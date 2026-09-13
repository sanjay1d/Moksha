# Moksha E-Commerce — Project Log

This is a full-stack e-commerce application built for the `UI → API → Database → Authentication → Business Logic → AI → Integration` assignment.

**Live Links**
- Frontend: `https://moksha-gray.vercel.app`
- Backend: `https://moksha-backend-d034.onrender.com`
- Repo: `https://github.com/sanjay1d/Moksha`

---

## Tech Stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Backend:** FastAPI + Python + Beanie ODM + Pydantic v2
- **Database:** MongoDB Atlas
- **Payments:** Stripe (test mode)
- **AI:** LangChain + OpenAI-compatible API (OpenRouter)
- **Auth:** JWT + Google OAuth 2.0
- **Hosting:** Render (backend) + Vercel (frontend)

---

## Phase 1 — Backend Foundation

1. Created FastAPI app with `Beanie` models for `User`, `Product`, `Cart`, `Order`.
2. Connected to MongoDB Atlas using `motor` and `pymongo`.
3. Added `pydantic-settings` for environment configuration.
4. Created `requirements.txt` and `.env.example`.
5. Implemented database seeding for products.

## Phase 2 — Authentication

1. Built email/password registration and login with `passlib` PBKDF2-SHA256.
2. Added JWT access token generation and `get_current_user` dependency.
3. Implemented Google token verification using `google-auth`.
4. Created `AuthContext` in React for session management.
5. Added protected routes and admin-only routes.

## Phase 3 — Product, Cart, and Order APIs

1. `GET/POST /products` with RBAC (admin can create).
2. `GET/POST/DELETE /cart` tied to authenticated user.
3. `GET/POST /orders` to create orders from the cart.
4. Product image upload via `/upload` and served under `/uploads`.
5. Image URL resolution across the frontend to support both absolute and relative URLs.

## Phase 4 — Stripe Payments

1. Created `POST /payments/checkout` to generate a Stripe Checkout session.
2. `GET /payments/verify` validates the session and updates the order status.
3. Frontend redirects to Stripe Checkout and then to `/orders` with `?session_id=...`.

## Phase 5 — AI Concierge

1. Built a `langchain` agent in `backend/app/ai/agent.py`.
2. Injected live product and order context into the prompt.
3. Created `POST /ai/chat` endpoint.
4. Redesigned the frontend `Support.tsx` as a dark glassmorphic chat interface.

## Phase 6 — UI Redesigns

Redesigned all customer-facing pages to a dark Moksha Studio visual language:
- `Navbar` (glass, compact, search, favorites, cart, responsive)
- `Home` (product catalog, filters, category chips)
- `ProductDetail` (editorial gallery, quantity, wishlist)
- `CartPage` (atelier checkout, quantity steppers, Stripe CTA)
- `LoginPage` (split-screen storytelling)
- `OrdersPage` (glass order history with status badges)
- `Support` (AI concierge chat)

Also added:
- Global dark background (`#0b0e17`)
- Shared Tailwind utilities (`glass-card`, `glow-ambient-top`, etc.)
- Search (navbar query param → `Home` filtering)
- Favorites/wishlist with `FavoritesContext` and `localStorage`

## Phase 7 — Deployment

### 7.1 Git & Git Ignore
- Initialized Git repo.
- Created `backend/.gitignore` and `frontend/.gitignore` to exclude `.env`, `node_modules`, `__pycache__`, `dist`, `uploads/`.
- Pushed to `https://github.com/sanjay1d/Moksha`.

### 7.2 MongoDB Atlas
- Created a free cluster.
- Added a database user and allowed `0.0.0.0/0` in the network access list.
- Saved the connection string for `MONGODB_URI`.

### 7.3 Backend on Render
- Created a Web Service with root directory `backend`.
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Added `python-3.11.10` to `backend/runtime.txt`.
- Set environment variables:
  - `MONGODB_URI`
  - `MONGODB_DB=moksha_db`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `ADMIN_EMAIL`
  - `STRIPE_SECRET_KEY`
  - `FRONTEND_URL=https://moksha-gray.vercel.app`
  - `OPENAI_BASE_URL`, `OPENAI_MODEL`, `OPENAI_API_KEY` (optional, for AI)

### 7.4 Frontend on Vercel
- Imported the GitHub repo.
- Framework: `Vite`, root directory: `frontend`.
- Added `frontend/vercel.json` with SPA rewrite rules.
- Set environment variables:
  - `VITE_API_URL=https://moksha-backend-d034.onrender.com`
  - `VITE_GOOGLE_CLIENT_ID=<same as GOOGLE_CLIENT_ID>`

### 7.5 Google OAuth
- Added `https://moksha-gray.vercel.app` as an **Authorized JavaScript origin** in the Google Cloud Console.

---

## Key Issues & Fixes During Deployment

| Issue | Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: langchain_core` | Missing packages in `requirements.txt` | Added `langchain`, `langchain-openai`, `openai` |
| `pymongo ServerSelectionTimeoutError: localhost:27017` | `MONGODB_URI` not recognized | Updated `backend/app/config.py` to accept both `MONGODB_URI` and `MONGODB_URL` |
| `client_id` Google error | `VITE_GOOGLE_CLIENT_ID` missing on Vercel | Added it as a visible environment variable and redeployed |
| CORS blocked on live | `FRONTEND_URL` not set / not redeployed | Set `FRONTEND_URL` to `https://moksha-gray.vercel.app` and redeployed Render |
| AI `Connection error` | Old `openai_api_base` parameter and free model | Switched to `base_url` / `api_key` in `ChatOpenAI`; suggested paid/reliable model |
| Product images not loading | Absolute `localhost` URLs from uploads | Created `frontend/src/utils/imageUrl.ts` to resolve relative/absolute URLs against `VITE_API_URL` and changed `uploads.py` to return relative paths |

---

## Environment Variable Checklist

### Render (backend)
- `MONGODB_URI`
- `MONGODB_DB=moksha_db`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `ADMIN_EMAIL`
- `STRIPE_SECRET_KEY`
- `FRONTEND_URL=https://moksha-gray.vercel.app`
- `OPENAI_BASE_URL=https://openrouter.ai/api/v1` (optional)
- `OPENAI_MODEL=openrouter/free` (or paid) (optional)
- `OPENAI_API_KEY` (optional)

### Vercel (frontend)
- `VITE_API_URL=https://moksha-backend-d034.onrender.com`
- `VITE_GOOGLE_CLIENT_ID=<Google Client ID>`

### Google Cloud Console
- Authorized JavaScript origin: `https://moksha-gray.vercel.app`

---

## Known Limitations

- Render free tier sleeps after inactivity; first request has a 30–60s cold start.
- Uploaded product images are stored on Render’s ephemeral disk and may disappear on restart. Use external image URLs for permanent demo products.
- Google OAuth requires the exact Vercel origin to be registered in Google Cloud Console.
- `openrouter/free` can be rate-limited or offline; use a paid OpenRouter model or real OpenAI key for reliable AI.

---

## Final Feature Checklist

- [x] Dark Moksha Studio UI
- [x] Product listing, search, and categories
- [x] Product detail with wishlist
- [x] Cart and quantity management
- [x] Email/password and Google OAuth login
- [x] Admin-only Add Product
- [x] Stripe test checkout
- [x] Order history
- [x] AI concierge chat with live product/order data
- [x] Deployed to Render + Vercel
