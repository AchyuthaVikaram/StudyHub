
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Search notes
router.get('/', async (req, res) => {
  try {
    const { 
      q: query, 
      subject, 
      university, 
      semester,
      fileType,
      page = 1, 
      limit = 12 
    } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let searchQuery = supabase
      .from('notes')
      .select(`
        *,
        user_profiles!notes_uploader_id_fkey(first_name, last_name, university)
      `);

    // Full text search on title and description
    searchQuery = searchQuery.or(`title.ilike.%${query}%, description.ilike.%${query}%`);

    // Apply additional filters
    if (subject && subject !== 'all') {
      searchQuery = searchQuery.ilike('subject', `%${subject}%`);
    }

    if (university) {
      searchQuery = searchQuery.ilike('university', `%${university}%`);
    }

    if (semester) {
      searchQuery = searchQuery.eq('semester', parseInt(semester));
    }

    if (fileType) {
      searchQuery = searchQuery.ilike('file_type', `%${fileType}%`);
    }

    // Sort by relevance (downloads + rating)
    searchQuery = searchQuery.order('downloads', { ascending: false });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    searchQuery = searchQuery.range(from, to);

    const { data: notes, error, count } = await searchQuery;

    if (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Search failed' });
    }

    res.json({
      query,
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get subject suggestions
    const { data: subjects } = await supabase
      .from('notes')
      .select('subject')
      .ilike('subject', `%${query}%`)
      .limit(5);

    // Get title suggestions
    const { data: titles } = await supabase
      .from('notes')
      .select('title')
      .ilike('title', `%${query}%`)
      .limit(5);

    const suggestions = [
      ...subjects?.map(s => ({ type: 'subject', value: s.subject })) || [],
      ...titles?.map(t => ({ type: 'title', value: t.title })) || []
    ];

    res.json({ suggestions: suggestions.slice(0, 8) });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Get popular search terms
router.get('/popular', async (req, res) => {
  try {
    // Get most common subjects
    const { data: popularSubjects } = await supabase
      .rpc('get_popular_subjects', { limit_count: 10 });

    // Get most downloaded notes (as popular content)
    const { data: popularNotes } = await supabase
      .from('notes')
      .select('title, subject, downloads')
      .order('downloads', { ascending: false })
      .limit(5);

    res.json({
      popularSubjects: popularSubjects || [],
      popularContent: popularNotes || []
    });

  } catch (error) {
    console.error('Popular search error:', error);
    res.status(500).json({ error: 'Failed to get popular searches' });
  }
});

module.exports = router;
