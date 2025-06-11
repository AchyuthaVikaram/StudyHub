
# StudyShare Backend API

A Node.js/Express API server for the StudyShare platform with Supabase integration.

## Features

- **Authentication**: Email/password login with Supabase Auth
- **File Upload**: Cloudinary integration for file storage
- **Notes Management**: CRUD operations for study materials
- **Search & Filter**: Advanced search with filters
- **Rating System**: User ratings and reviews
- **Dashboard**: User analytics and statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Cloudinary
- **AI Services**: Google Gemini API (planned)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
```

3. Run database migrations:
```bash
# Execute schema.sql in your Supabase SQL editor
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes/upload` - Upload new note
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes/:id/download` - Record download
- `POST /api/notes/:id/rate` - Rate a note
- `GET /api/notes/user/uploads` - Get user's uploads

### Search
- `GET /api/search` - Search notes
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/popular` - Get popular subjects

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

## Database Schema

The API uses the following main tables:
- `user_profiles` - User information
- `notes` - Study materials metadata
- `note_ratings` - User ratings for notes
- `note_downloads` - Download tracking
- `note_favorites` - User favorites
- `note_summaries` - AI-generated summaries

## Security

- Row Level Security (RLS) enabled on all tables
- JWT token authentication
- Input validation and sanitization
- Rate limiting (planned)
- File type validation

## Deployment

The API is designed to be deployed on platforms like:
- Render
- Heroku
- Railway
- AWS/GCP/Azure

Make sure to set all environment variables in your deployment platform.
