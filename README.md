# ComplaintHub - Online Complaint Management System

A full-stack, premium web application for managing customer complaints with role-based access and real-time tracking.

## Technologies
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **Design**: DM Sans font, premium glassmorphism effects, responsive layout.

## Features
- **Role-Based Auth**: Separate dashboards for Users and Admins.
- **User Dashboard**: Overview of complaint status cards and quick navigation.
- **Complaint Submission**: Multi-field form with priority and category selection.
- **My Complaints**: Searchable and filterable portal to track individual submissions.
- **Admin Dashboard**: Centralized management of all system complaints with status update actions.
- **Help Center**: Integrated FAQ and contact support channels.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally on `mongodb://127.0.0.1:27017/complainthub`)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Note: The backend will auto-seed demo data on first run.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Demo Credentials
- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Directory Structure
- `backend/`: API routes, models, middleware, and server logic.
- `frontend/`: React components, pages, context, and styling.
