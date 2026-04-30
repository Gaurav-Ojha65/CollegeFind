# FILE: DEPLOYMENT.md

## Backend Deployment (Render.com)

1. Push backend/ folder to a GitHub repository
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Set:
   - Build Command: npm install
   - Start Command: npm start
   - Environment: Node
5. Add Environment Variables:
   - DB_HOST (from your PostgreSQL service)
   - DB_PORT = 5432
   - DB_USER, DB_PASSWORD, DB_NAME
   - PORT = 5000
   - FRONTEND_URL = (your Vercel URL, add after deploy)
6. Create a PostgreSQL database on Render (New → PostgreSQL)
7. Copy the Internal Database URL values into the env vars
8. Run schema.sql on the database using psql or Render's shell

## Frontend Deployment (Vercel)

1. Push frontend/ folder to a GitHub repository
2. Go to vercel.com → New Project → Import repo
3. Set Root Directory to frontend/ if in a monorepo
4. Add Environment Variable:
   - NEXT_PUBLIC_API_URL = your Render backend URL (e.g. https://college-api.onrender.com)
5. Deploy

## Run schema.sql on Render

In Render dashboard → your PostgreSQL instance → Shell:
```
psql $DATABASE_URL -f schema.sql
```

Or copy-paste SQL manually via Render's query editor.
