# ComplaintHub 🎓


ComplaintHub streamlines how students raise issues and how staff resolves them, with a complete lifecycle from submission to resolution, an AI-powered assistant, and role-based dashboards.

---

## ✨ Features

- **3-Role System** — Student, Staff, and Admin each get tailored dashboards and permissions
- **Full Complaint Lifecycle** — Submit → Assign → Resolve → Track, with status updates at every step
- **Smart Staff Assignment** — Suggestions based on workload and historical resolution rate
- **Priority-Based Due Dates** — Auto-calculated (Urgent: 1 day, High: 3 days, Medium: 7 days, Low: 14 days)
- **Overdue Detection** — Automatic alerts when complaints miss their deadlines
- **Matty AI Chatbot** — Custom-personality assistant powered by Google Gemini with live MongoDB context
- **JWT Authentication** — Secure, role-based access control
- **Real-Time Statistics** — Admin dashboard with live metrics and staff performance data

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React + Vite + Tailwind CSS       |
| Backend    | Node.js + Express                 |
| Database   | MongoDB                           |
| AI Chatbot | Gemini API + offline API          |
| Auth       | JSON Web Tokens (JWT)             |

---

## 👥 Roles & Permissions

| Action                        | Student | Staff | Admin |
|-------------------------------|:-------:|:-----:|:-----:|
| Submit complaint               | ✅      | —     | ✅    |
| View own complaints            | ✅      | —     | ✅    |
| View assigned complaints       | —       | ✅    | ✅    |
| Resolve / update complaints    | —       | ✅    | ✅    |
| Delete complaints              | —       | ❌    | ✅    |
| Assign complaints to staff     | —       | —     | ✅    |
| Manage users & system          | —       | —     | ✅    |

---

## 📂 Project Structure

```
sepm_project/
├── backend/
│   ├── models/          # Mongoose schemas (User, Complaint)
│   ├── routes/          # Express API routes
│   ├── middleware/       # JWT auth middleware
│   ├── controllers/     # Route logic
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Role-specific dashboards
    │   └── App.jsx      # Root component + routing
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/Arunkumar2010/complainthub.git
cd complainthub
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:


> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔑 Demo Credentials

| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Student | arun@college.edu       | *(set yours)* |
| Admin   | admin1@gmail.com       | *(set yours)* |

---

## 🤖 Matty — AI Chatbot

Matty is ComplaintHub's built-in assistant with a custom personality, shaped entirely through prompt engineering. It draws on live MongoDB data to answer questions about complaint status, college policies, and system usage — no fine-tuning required.

**Model used:** `gemini-2.0-flash-lite` (free tier, no credit card needed)

---

## 🧪 Testing

The project includes documented test cases across two sprints:

- **Sprint 1** — 10 test cases
- **Sprint 2** — 15 test cases
- **Bugs documented** — BUG_000 through BUG_003, each with root cause and resolution

---

## 📌 Complaint Categories

WiFi · Hostel · Mess Food · Maintenance · Billing · Security · Academics

---

## 📄 License

This project was built for academic purposes 

---

<p align="center">Built with ❤️ in 2026</p>
