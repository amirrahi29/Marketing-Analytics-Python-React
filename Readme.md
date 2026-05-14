# Rahi Analytics

Marketing analytics API (Flask) and dashboard (React + Vite). The UI expects the API at `http://127.0.0.1:5001` (see `frontend/src/services/api.ts` if you change the port).

## Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs on port **5001** with `general_data.csv` in the same folder.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Use `npm run build` for production static output in `frontend/dist`.
