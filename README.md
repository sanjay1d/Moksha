# Moksha Studio — Full-Stack E-Commerce

A dark, glassmorphic full-stack e-commerce application with React, FastAPI, MongoDB, Stripe, and AI support.

**Live Demo:** `https://moksha-gray.vercel.app`  
**Backend:** `https://moksha-backend-d034.onrender.com`  
**Repo:** `https://github.com/sanjay1d/Moksha`  
**Time Taken:** 1 day

---

## Features

- **Product Catalog** — browse, search, and filter products
- **Product Details** — image gallery, quantity selector, add-to-cart, wishlist
- **Cart & Checkout** — quantity steppers, Stripe Checkout integration
- **Order History** — status badges and live order records
- **Authentication** — email/password and Google OAuth
- **Admin Panel** — admin-only Add Product with image upload
- **AI Concierge** — product and order-aware support chat
- **Responsive Dark UI** — Moksha Studio design language

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python, Beanie ODM, Pydantic v2 |
| Database | MongoDB Atlas |
| Payments | Stripe (test mode) |
| AI | LangChain, OpenAI-compatible API |
| Auth | JWT + Google OAuth 2.0 |
| Hosting | Render (backend), Vercel (frontend) |

---

## Quick Start

### Local development

**Backend**
```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

See `PROJECT_LOG.md` for the full checklist.

---

## Deployment

- **Backend** is deployed on Render. Build: `pip install -r requirements.txt`, Start: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
- **Frontend** is deployed on Vercel. Framework: Vite, root: `frontend`.
- **Database** is MongoDB Atlas.
- **Google OAuth** requires the Vercel domain in Google Cloud Console.

---

## Notes

- Render free tier sleeps after inactivity, so the first backend request may take 30–60s.
- Uploaded product images are stored on Render’s ephemeral disk. Use external image URLs for permanent demo products.
- See `PROJECT_LOG.md` for a detailed phase-by-phase build record and troubleshooting guide.

---

## System Design

```
[User]
   │ HTTPS
   ▼
[Vercel Frontend]
   │ REST/JSON
   ▼
[Render FastAPI Backend]
   ├─ [MongoDB Atlas]
   ├─ [Stripe API]
   ├─ [OpenAI-compatible LLM]
   └─ [Google OAuth]
```

| Component | Role | Technology |
|---|---|---|
| Frontend | UI, routing, client state | Vite, React, TypeScript, Tailwind CSS |
| Backend | REST API, auth, business logic | FastAPI, Python, Beanie ODM |
| Database | Products, users, cart, orders, sessions | MongoDB Atlas |
| AI Agent | Product/order-aware support answers | LangChain + OpenAI-compatible API |
| Google Authentication | SSO login | Google OAuth 2.0 |
| Stripe | Test-mode checkout and payment sessions | Stripe Checkout |
| AWS / Deployment | Hosting, storage, scaling | Current: Vercel + Render; Scale: AWS S3, CloudFront, ECS/Beanstalk, ElastiCache |

## Scaling

If user traffic and AI requests grow significantly:

- **Backend:** containerize the FastAPI app and run multiple instances behind a load balancer with auto-scaling.
- **Database:** MongoDB Atlas replica sets for reads and sharding for very large write loads.
- **Assets:** move product images to AWS S3 and serve via CloudFront CDN instead of storing them on ephemeral Render disk.
- **Caching:** add Redis (e.g. AWS ElastiCache) for product catalog, cart snapshots, and AI context to reduce DB and LLM calls.
- **AI:** introduce rate limiting and an async queue (Celery + Redis/RabbitMQ) for non-urgent AI tasks; cache common responses.
- **Payments:** continue using Stripe’s managed infrastructure; use idempotency keys and reliable webhook handling.
- **Frontend:** Vercel already serves from a global CDN; keep builds optimized and lazy-load heavy assets.

## License

This project is for educational / assignment purposes.
