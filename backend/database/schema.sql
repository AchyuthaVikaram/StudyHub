
-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  university VARCHAR(255),
  course VARCHAR(255),
  semester INTEGER,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  semester INTEGER,
  university VARCHAR(255),
  tags TEXT[],
  file_url TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  uploader_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create note ratings table
CREATE TABLE IF NOT EXISTS note_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);

-- Create note downloads tracking table
CREATE TABLE IF NOT EXISTS note_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  download_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create note favorites table
CREATE TABLE IF NOT EXISTS note_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);

-- Create note summaries table (for AI-generated summaries)
CREATE TABLE IF NOT EXISTS note_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  key_points TEXT[],
  generated_by VARCHAR(50) DEFAULT 'gemini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_university ON notes(university);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_uploader ON notes(uploader_id);
CREATE INDEX IF NOT EXISTS idx_notes_upload_date ON notes(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_notes_downloads ON notes(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_notes_rating ON notes(rating DESC);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || description));

-- Create RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_summaries ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Notes policies
CREATE POLICY "Anyone can view notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = uploader_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = uploader_id);

-- Note ratings policies
CREATE POLICY "Anyone can view ratings" ON note_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own ratings" ON note_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON note_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON note_ratings FOR DELETE USING (auth.uid() = user_id);

-- Note downloads policies
CREATE POLICY "Anyone can insert downloads" ON note_downloads FOR INSERT USING (true);
CREATE POLICY "Users can view own downloads" ON note_downloads FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Note favorites policies
CREATE POLICY "Users can view own favorites" ON note_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON note_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON note_favorites FOR DELETE USING (auth.uid() = user_id);

-- Note summaries policies
CREATE POLICY "Anyone can view summaries" ON note_summaries FOR SELECT USING (true);

-- Create function to get popular subjects
CREATE OR REPLACE FUNCTION get_popular_subjects(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(subject TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT n.subject, COUNT(*) as count
  FROM notes n
  GROUP BY n.subject
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to update note rating
CREATE OR REPLACE FUNCTION update_note_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE notes
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM note_ratings
      WHERE note_id = COALESCE(NEW.note_id, OLD.note_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM note_ratings
      WHERE note_id = COALESCE(NEW.note_id, OLD.note_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.note_id, OLD.note_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating note ratings
CREATE TRIGGER trigger_update_note_rating
  AFTER INSERT OR UPDATE OR DELETE ON note_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_note_rating();

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(note_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notes
  SET downloads = downloads + 1, updated_at = NOW()
  WHERE id = note_uuid;
END;
$$ LANGUAGE plpgsql;
