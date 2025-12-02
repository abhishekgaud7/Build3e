# BUILD‑SETU (Build3e)

Hyperlocal marketplace for construction materials (Gwalior, India).

## Stack

- Frontend: Vite + React + TypeScript + React Router + React Query + Tailwind + shadcn/ui
 - Backend: Node.js + TypeScript + Express + Prisma (Supabase Postgres) + JWT (email+password)
- Testing: Jest (backend)

## Getting Started

### Frontend
- `npm install`
- `npm run dev`
- App runs at `http://localhost:5173`

### Backend
- `cd backend`
- `npm install`
- Copy env: `cp .env.example .env` then set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
- Migrate: `npm run migrate -- --name init` and `npm run generate`
- Dev: `npm run dev` (set `PORT` if `3000` is busy)
- Health: `GET http://localhost:3000/health`

## API Highlights

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`
- Products & Categories: public browse, seller/admin create/update/delete, soft delete
- Addresses: CRUD for logged-in user with ownership enforcement
- Orders: creation with DB-calculated pricing/totals, status updates by seller/admin
- Support: tickets and messages, role-derived sender type

## Security

- No SMS/OTP; email + password auth only
- bcrypt hashing, JWT expiry 1h
- zod validation, centralized error handler, role-based access
- CORS locked to frontend URL, Helmet enabled

## Notes

- Do not commit `.env` files; use `.env.example`
- Prisma schema and migrations live in `backend/prisma/`
- See `backend/README.md` for detailed backend docs
