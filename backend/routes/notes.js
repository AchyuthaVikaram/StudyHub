
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Upload note
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description, subject, semester, university, tags } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    if (!title || !subject) {
      return res.status(400).json({ error: 'Title and subject are required' });
    }

    // Upload file to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'studyshare/notes',
          public_id: `${uuidv4()}-${file.originalname}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const cloudinaryResult = await uploadPromise;

    // Save note metadata to database
    const { data: noteData, error: noteError } = await supabase
      .from('notes')
      .insert({
        id: uuidv4(),
        title,
        description: description || '',
        subject,
        semester: semester ? parseInt(semester) : null,
        university: university || '',
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        file_url: cloudinaryResult.secure_url,
        file_type: file.mimetype,
        file_size: file.size,
        original_filename: file.originalname,
        cloudinary_public_id: cloudinaryResult.public_id,
        uploader_id: req.user.id,
        upload_date: new Date().toISOString(),
        downloads: 0,
        rating: 0,
        rating_count: 0
      })
      .select()
      .single();

    if (noteError) {
      console.error('Database error:', noteError);
      // Clean up uploaded file
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      return res.status(500).json({ error: 'Failed to save note metadata' });
    }

    res.status(201).json({
      message: 'Note uploaded successfully',
      note: noteData
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all notes with filters
router.get('/', async (req, res) => {
  try {
    const { 
      subject, 
      semester, 
      university, 
      search, 
      page = 1, 
      limit = 12,
      sortBy = 'upload_date',
      sortOrder = 'desc'
    } = req.query;

    let query = supabase
      .from('notes')
      .select(`
        *,
        user_profiles!notes_uploader_id_fkey(first_name, last_name, university)
      `);

    // Apply filters
    if (subject && subject !== 'all') {
      query = query.ilike('subject', `%${subject}%`);
    }

    if (semester) {
      query = query.eq('semester', parseInt(semester));
    }

    if (university) {
      query = query.ilike('university', `%${university}%`);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%, description.ilike.%${search}%, tags.cs.{${search}}`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: notes, error, count } = await query;

    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }

    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Fetch notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: note, error } = await supabase
      .from('notes')
      .select(`
        *,
        user_profiles!notes_uploader_id_fkey(first_name, last_name, university, course)
      `)
      .eq('id', id)
      .single();

    if (error || !note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ note });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Download note
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    // Increment download count
    const { error } = await supabase
      .from('notes')
      .update({ downloads: supabase.raw('downloads + 1') })
      .eq('id', id);

    if (error) {
      console.error('Download count error:', error);
    }

    res.json({ message: 'Download recorded' });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Rate note
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already rated this note
    const { data: existingRating } = await supabase
      .from('note_ratings')
      .select('id, rating')
      .eq('note_id', id)
      .eq('user_id', req.user.id)
      .single();

    if (existingRating) {
      // Update existing rating
      await supabase
        .from('note_ratings')
        .update({ rating, updated_at: new Date().toISOString() })
        .eq('id', existingRating.id);
    } else {
      // Create new rating
      await supabase
        .from('note_ratings')
        .insert({
          note_id: id,
          user_id: req.user.id,
          rating,
          created_at: new Date().toISOString()
        });
    }

    // Update note's average rating
    const { data: ratings } = await supabase
      .from('note_ratings')
      .select('rating')
      .eq('note_id', id);

    if (ratings && ratings.length > 0) {
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      
      await supabase
        .from('notes')
        .update({ 
          rating: Math.round(avgRating * 10) / 10,
          rating_count: ratings.length
        })
        .eq('id', id);
    }

    res.json({ message: 'Rating submitted successfully' });

  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get user's uploaded notes
router.get('/user/uploads', authenticateToken, async (req, res) => {
  try {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('uploader_id', req.user.id)
      .order('upload_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user notes' });
    }

    res.json({ notes });

  } catch (error) {
    console.error('Get user notes error:', error);
    res.status(500).json({ error: 'Failed to fetch user notes' });
  }
});

module.exports = router;
