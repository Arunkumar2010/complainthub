# ComplaintHub 🎓

An Online Complaint Management System for college students built as a SEPM project.

## Features
- 3-role system: Student, Staff, Admin
- Complete complaint workflow
- Matty AI chatbot (Google Gemini)
- JWT authentication
- Due date auto-calculation  
- Smart staff assignment suggestions
- Real-time statistics

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- AI: Google Gemini API

## Roles
- Student: Submit and track complaints
- Staff: Handle assigned complaints
- Admin: Full system control

## Setup Instructions

### Backend
cd backend
npm install
Create .env file with:
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_secret_key
  GEMINI_API_KEY=your_gemini_key
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Demo Credentials
Student: arun@college.edu
Admin: admin1@gmail.com

## Project Structure
sepm_project/
  backend/    - Node.js + Express API
  frontend/   - React + Vite app

Built with love for SEPM academic project 2026
