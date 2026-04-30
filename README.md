# 🎓 CollegeFind — College Discovery Platform

A full-stack web application to discover, filter, compare, and get smart recommendations for Indian engineering colleges based on user preferences like rank, budget, and location.

---

## 🚀 Features

* 🔍 Search colleges by name
* 📍 Filter by location and budget
* 📊 Sort by rating, fees, and placement %
* ⚖️ Compare multiple colleges side-by-side
* 🎯 Smart college predictor (rank + budget based)
* 💾 Persistent compare selection (localStorage)
* ⚡ Fast and responsive UI with loading states

---

## 🧱 Tech Stack

### Frontend

* Next.js 14 (React 18)
* Tailwind CSS
* Context API (State Management)

### Backend

* Node.js
* Express.js
* PostgreSQL (Supabase)
* REST APIs

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render
* Database: Supabase PostgreSQL

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
│   │   └── app.js
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── lib/
│
├── schema.sql
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/Gaurav-Ojha65/CollegeFind.git
cd CollegeFind
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside `backend`:

```
DATABASE_URL=your_database_url
PORT=5000
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | /api/colleges         | Get all colleges    |
| GET    | /api/colleges/:id     | Get college by ID   |
| POST   | /api/colleges/compare | Compare colleges    |
| POST   | /api/colleges/predict | Get recommendations |

---

## 🧠 College Predictor Logic

Currently uses a weighted scoring approach based on:

* Rating
* Placement Percentage
* Fees (penalty)

⚠️ Note: Rank input is currently accepted but not fully utilized in scoring logic. Future versions will include rank-based filtering for more accurate recommendations.

---

## ⚠️ Known Issues

* Rank input not fully integrated into prediction logic
* Some initial seed data required correction
* No authentication system (planned)

---

## 📌 Future Improvements

* Improve prediction algorithm (rank-aware recommendations)
* Add authentication (login/signup)
* Convert to microservices architecture
* Add charts and analytics for comparison
* Full production deployment with CI/CD

---

## 👨‍💻 Author

Gaurav Ojha

---

## ⭐ If you found this useful, consider giving it a star!
