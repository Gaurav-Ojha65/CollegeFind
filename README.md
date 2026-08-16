# CollegeFind

A deployed full-stack college discovery platform for searching, comparing, and evaluating colleges using fees, placements, rankings, courses, and historical cutoff data.

## Live system

- **Frontend:** https://college-find-one.vercel.app
- **Backend API:** https://college-dp.onrender.com/api/colleges

## Why this project?

Students often need to compare colleges across multiple factors rather than rely on a single ranking. CollegeFind combines search, comparison, cutoff-based prediction, authentication, saved colleges, and ROI calculations into one application.

## Architecture

```text
Next.js Frontend
      │
      │ REST / JSON
      ▼
Node.js + Express API
      │
      ├── Authentication / JWT
      ├── College search & filters
      ├── Comparison / predictor logic
      └── Saved-college APIs
      │
      ▼
PostgreSQL / Supabase
      │
      ├── Colleges
      ├── Courses
      ├── Cutoffs
      ├── Placements
      ├── Facilities
      └── Users
```

## Key engineering features

- Search and filtering by location, budget, and college name.
- Side-by-side college comparison with Recharts visualizations.
- Rank predictor using historical closing ranks, course, category, and exam type to classify colleges as Safe, Moderate, or Reach.
- JWT authentication with hashed passwords.
- Saved/bookmarked colleges for authenticated users.
- PostgreSQL relational schema hosted through Supabase.
- Separate deployed frontend and backend services.
- Request logging and centralized Express error handling in the backend.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS, Recharts, Lucide React |
| Backend | Node.js, Express.js, REST APIs |
| Database | PostgreSQL / Supabase |
| Authentication | JWT, bcrypt |
| Deployment | Vercel, Render |

## Repository structure

```text
CollegeFind/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       └── routes/
├── frontend/
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── pages/
├── DEPLOYMENT.md
├── schema_v2.sql
└── README.md
```

## Run locally

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

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

Then run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

## Security notes

- Secrets are supplied through environment variables rather than committed configuration.
- Authentication uses JWT and bcrypt.
- Backend routes include authentication middleware for protected operations.
- Do not commit real database credentials or JWT secrets.

## Engineering focus

This is primarily a **full-stack engineering project** demonstrating API design, relational data modeling, authentication, frontend state/UI integration, deployment, and application-level business logic.

## Author

**Gaurav Ojha**  
Computer Science student focused on software engineering, backend systems, cloud infrastructure, and practical AI/ML.
