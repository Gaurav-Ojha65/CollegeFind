# 🎓 College Discovery Platform

A modern full-stack web application that helps students explore, compare, and predict colleges based on rankings, fees, placements, and courses.

---

## 🌐 Live Demo

**Frontend (Vercel):** [https://college-find-one.vercel.app](https://college-find-one.vercel.app)

**Backend API (Render):** [https://college-dp.onrender.com/api/colleges](https://college-dp.onrender.com/api/colleges)

---

## 🚀 Features

* **College search and filtering:** Advanced filters by location, max budget, and name.
* **College comparison system:** Interactive side-by-side comparison featuring Recharts (Radar & Bar charts) for fees, rating, and placements.
* **Rank predictor:** Smart prediction engine with course-level cutoff analysis. Identifies Safe, Moderate, and Reach colleges using historical closing ranks, exam types (JEE Main, JEE Advanced, WBJEE, etc.), and categories.
* **Real-time backend API integration:** Node.js/Express REST API handling complex queries and math.
* **PostgreSQL database integration:** Hosted on Supabase with a robust relational schema (Colleges, Courses, Cutoffs, Placements, Facilities, Users).
* **Responsive modern UI:** Premium dark-theme aesthetics with glassmorphism, responsive grids, and micro-animations using Tailwind CSS.
* **Full-stack deployment:** Frontend deployed on Vercel; Backend hosted on Render.
* **Authentication System:** Secure JWT-based user authentication (Login/Signup) with hashed passwords.
* **Saved Bookmarks:** Authenticated users can bookmark colleges to their profile.
* **ROI Calculator:** Built-in tool estimating loan payback time based on branch-specific average placement packages.
* **Official Website Integration:** Direct links to official college websites with an intelligent fallback to automated Google Search queries.

---

## 🧱 Tech Stack

### Frontend
* Next.js 14 (React 18)
* Tailwind CSS (Glassmorphism & Custom Animations)
* Recharts (Data Visualization)
* Lucide React (Icons)
* Context API (State Management)

### Backend
* Node.js & Express.js
* PostgreSQL (via Supabase)
* JSON Web Tokens (JWT) & bcrypt (Authentication)
* REST APIs

---

## 📂 Project Structure

```
CollegeFind/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── middleware/ (Auth)
│   │   └── app.js
│
├── frontend/
│   ├── pages/ (index, predict, compare, dashboard, login, signup, college/[id])
│   ├── components/
│   ├── context/
│   └── lib/ (api client)
│
├── schema_v2.sql (DB Schema)
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Gaurav-Ojha65/CollegeFind.git
cd CollegeFind
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
DB_HOST=your_supabase_host
DB_PORT=6543
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=postgres
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 👨‍💻 Author

Gaurav Ojha

---

## ⭐ If you found this useful, consider giving it a star!
