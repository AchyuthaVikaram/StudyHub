
# 📚 StudyHub

**StudyHub** is a full-stack collaborative platform where students can upload, search, rate, and download syllabus-aligned study materials like notes and previous year questions, organized by subject, semester, and university.

## 🚀 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Shadcn UI  
- **Backend**: Node.js, Express.js, Supabase, Cloudinary  
- **AI Integration**: Gemini 1.5 Flash (Google Generative AI)  
- **Database**: Supabase (PostgreSQL)  
- **Cloud Storage**: Cloudinary

---
## 📂 Folder Structure

```bash
StudyHub/
├── backend/           # Express server with Supabase and Gemini AI logic
│   ├── routes/
│   ├── utils/
│   └── index.js       # Entry point (runs on PORT 5000)
|   ├── .env     
| # frontend code is in root folder itself
│   ├── src/
│   └── vite.config.js
          # Environment variables
└── README.md
```
## Environment Variables
Create a .env file in the backend/ directory with the following:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_generative_ai_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
## AI Features (Gemini 1.5 Flash)
🔍 Summarize Note: AI-generated summary of uploaded notes

🧠 Suggest Related Topics: Recommends relevant topics

🗂️ Auto-Categorize Notes: Assigns notes to appropriate subject category

## Backend (Port 5000)
```bash
cd backend/
npm install
npm start
```
## Frontend (Port 8080)
```bash
npm install
npm run dev
```



