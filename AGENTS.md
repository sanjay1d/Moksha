# Assignment-2 Agent Notes

## Stack
- Frontend: Vite + React + TypeScript + Tailwind CSS + Shadcn UI
- Backend: FastAPI + Pydantic + Beanie + Motor
- Database: MongoDB (local or Atlas)

## Verified Commands

Backend (from `Assignment-2/backend`):
```powershell
.\.venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Health check: `curl http://localhost:8000/health`

Frontend (from `Assignment-2/frontend`):
```powershell
npm run dev
npm run build
```

## Notes
- Python 3.14 detected; packages were installed without hard pins to get wheels built for 3.14.
- AI dependencies (langchain, langchain-openai, openai) are intentionally left out of the base install and will be added in Phase 6.
- TypeScript 6.0 pre-release deprecates `baseUrl`; `ignoreDeprecations` is set in `tsconfig.app.json`.
