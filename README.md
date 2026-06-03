# EduMart — Student Marketplace MVP

Full-stack campus marketplace with registration, profiles, buy/sell, notes upload, search, chat, and Razorpay payments.

## MVP features

- User registration / login (email + Google + JWT)
- Student profile
- Sell & buy products
- Notes PDF upload
- Search & filter
- Buyer–seller chat (Socket.io)
- Razorpay (UPI, cards, net banking when configured)
- Admin panel (approve listings, earnings)

**Version 2 (not implemented):** AI notes quality checker, full AI price engine.

## Project structure

```
EduMart/
  EduMart/     # React + Vite frontend
  server/      # Express + MongoDB API
```

## Setup

### 1. MongoDB

**No install needed for local dev:** if MongoDB is not running, the server automatically uses an **in-memory database** (data resets when you stop the server).

For persistent data, install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set `MONGODB_URI` in `server/.env`.

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env: JWT_SECRET, optional Cloudinary, Razorpay, Google, ADMIN_EMAIL
npm install
npm run dev
```

API: `http://localhost:5000`

### 3. Frontend

```bash
cd EduMart
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173` (proxies `/api` to the backend)

### Environment variables

| Service | Variables |
|---------|-----------|
| Server | `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `CLOUDINARY_*`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_EMAIL` |
| Client | `VITE_GOOGLE_CLIENT_ID`, `VITE_SOCKET_URL` |

Set `ADMIN_EMAIL` to your email when registering to get admin access.

### Sell flow

Login → **Sell** → upload images/PDF → set price → **Publish** → admin approves → appears on marketplace.

### Payments

Without Razorpay keys, checkout runs in **demo mode**. Add Razorpay test keys for UPI, cards, and net banking.

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/marketplace` | Marketplace |
| `/product/:id` | Product details |
| `/sell` | Sell product |
| `/digital` | Digital products |
| `/freelance` | Freelance services |
| `/login`, `/register` | Auth |
| `/dashboard` | User dashboard |
| `/chat` | Chat |
| `/profile` | Profile |
| `/admin` | Admin dashboard |
