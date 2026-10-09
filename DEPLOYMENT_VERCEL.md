# 🚀 PlaceIQ LMS - Vercel Deployment & Database Guide

This guide provides instructions to set up the SQL Database with fake seed data and deploy both the **Frontend (React + Vite)** and **Backend (Express Node.js)** onto **Vercel** as a live web application.

---

## 📁 Project Structure

```
LMS-SYSTEM-RK/
├── api/
│   └── index.js              # Vercel Serverless Function API Bridge
├── backend/
│   ├── database/
│   │   ├── schema.sql        # Database Tables Creation Script
│   │   └── seed_data.sql      # Seed Fake Data Insertion SQL Script
│   ├── controllers/          # API Controllers
│   ├── routes/               # Express API Routes (/api/auth, /api/student, etc.)
│   └── server.js             # Express Backend Server
├── src/                      # Frontend React Components & CSS
├── vercel.json               # Vercel Production Deployment Config
└── package.json              # Main Dependencies & Scripts
```

---

## 🗄️ Database Setup (SQL & Fake Data)

The repository includes pre-built SQL scripts in `backend/database/`:
- `schema.sql`: Creates tables for `users`, `courses`, `assessments`, `coding_problems`, `placement_drives`, `applications`, and `doubts`.
- `seed_data.sql`: Inserts realistic fake data (Student profiles, Faculty trainers, TPO Placement Officers, Mock Tests, Coding Arena problems, and Campus Drives for Amazon, TCS, Flipkart, Google, etc.).

### How to Import SQL Seed Data:

#### Option A: Vercel Postgres / Neon DB / Supabase (PostgreSQL)
1. Go to your PostgreSQL database console (Vercel Postgres, Neon.tech, or Supabase).
2. Open the **SQL Editor**.
3. Run `backend/database/schema.sql` first.
4. Run `backend/database/seed_data.sql` to populate fake records.

#### Option B: Local / Self-Hosted MySQL / PostgreSQL
```bash
# PostgreSQL
psql -U your_user -d placeiq_db -f backend/database/schema.sql
psql -U your_user -d placeiq_db -f backend/database/seed_data.sql

# MySQL
mysql -u your_user -p placeiq_db < backend/database/schema.sql
mysql -u your_user -p placeiq_db < backend/database/seed_data.sql
```

---

## ☁️ Deploying to Vercel

### Option 1: Via Vercel Web Dashboard (GitHub Integration)
1. Push your repository to **GitHub**.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository (`LMS-SYSTEM`).
4. Vercel will automatically detect `package.json` and `vercel.json`.
5. Click **"Deploy"**. Vercel will build both the frontend bundle and serverless API backend!

### Option 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🔑 Default Seed Demo User Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `aarav.sharma@vit.ac.in` | `PlaceIQ2026!` |
| **Trainer / Faculty** | `rajesh.kumar@vit.ac.in` | `PlaceIQ2026!` |
| **Placement Officer (TPO)** | `tpo.officer@vit.ac.in` | `PlaceIQ2026!` |
