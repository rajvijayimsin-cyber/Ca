# CareNest — Find, book, and pay trusted caregivers by the hour

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React, Vite
- **Database:** PostgreSQL

## Getting Started

**Extract the ZIP** and open the project folder.

### Step 1: Environment Variables

Set these variables in a `.env` file in the backend directory:

- `APP_NAME` — Application name (e.g., CareNest)
- `APP_ENV` — Environment (e.g., production, development)
- `DEBUG` — Enable debug mode (`true`/`false`)
- `SECRET_KEY` — Random string for app security
- `DATABASE_URL` — PostgreSQL connection string
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` — Database connection details
- `JWT_SECRET_KEY` — Secret for JWT tokens
- `JWT_ALGORITHM` — JWT algorithm (e.g., HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` — Access token expiry (minutes)
- `REFRESH_TOKEN_EXPIRE_DAYS` — Refresh token expiry (days)
- `CORS_ORIGINS` — Allowed frontend origins (e.g., http://localhost:3000)

### Step 2: Install & Run Backend

1. Open a terminal in the backend folder.
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Run the API server:
   - `uvicorn app.main:app --reload`
4. API docs available at: `http://localhost:8000/docs`

### Step 3: Install & Run Frontend

1. Open a terminal in the frontend folder.
2. Install dependencies:
   - `npm install`
3. Start the development server:
   - `npm run dev`
4. Visit the app at: `http://localhost:3000`

## Deployment

To run with Docker:

1. Build and start all services:
   - `docker compose up --build`
2. The backend will be available at `http://localhost:8000`, frontend at `http://localhost:3000`.

For production, set all environment variables in your deployment environment and use `docker compose -f docker-compose.prod.yml up -d` if provided.

## Compliance

- HIPAA: All user data, health info, and communications are protected per HIPAA requirements.
- Privacy: Only verified caregivers are shown; users see only their own data; data export and deletion supported.
- Age: Users must be 18+.
- No AI features; demo data clearly marked.