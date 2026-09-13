# Moksha Studio — Full-Stack E-Commerce

A dark, glassmorphic full-stack e-commerce application with React, FastAPI, MongoDB, Stripe, and AI support.

**Live Demo:** `https://moksha-gray.vercel.app`  
**Backend:** `https://moksha-backend-d034.onrender.com`  
**Repo:** `https://github.com/sanjay1d/Moksha`

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

## License

This project is for educational / assignment purposes.
