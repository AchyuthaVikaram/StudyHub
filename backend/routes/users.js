
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, university, course, semester } = req.body;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        university,
        course,
        semester: semester ? parseInt(semester) : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update profile' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      profile 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get user's uploaded notes count
    const { count: uploadedNotesCount } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('uploader_id', req.user.id);

    // Get total downloads of user's notes
    const { data: userNotes } = await supabase
      .from('notes')
      .select('downloads')
      .eq('uploader_id', req.user.id);

    const totalDownloads = userNotes?.reduce((sum, note) => sum + note.downloads, 0) || 0;

    // Get user's recent uploads
    const { data: recentUploads } = await supabase
      .from('notes')
      .select('id, title, subject, upload_date, downloads, rating')
      .eq('uploader_id', req.user.id)
      .order('upload_date', { ascending: false })
      .limit(5);

    // Get user's ratings given
    const { count: ratingsGiven } = await supabase
      .from('note_ratings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    res.json({
      stats: {
        uploadedNotes: uploadedNotesCount || 0,
        totalDownloads,
        ratingsGiven: ratingsGiven || 0
      },
      recentUploads: recentUploads || []
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
