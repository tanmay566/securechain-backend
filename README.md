# SecureChain

A blockchain-based healthcare asset tracking and verification system for vaccines and medical equipment. Combines a FastAPI backend with a custom hash-linked ledger (`SimpleChain`) for tamper-evident event logging, and a React frontend for registering and viewing assets.

## Project Structure

```
securechain-backend/
├── backend/
│   ├── main.py           # FastAPI app, all API endpoints
│   ├── models.py         # SQLAlchemy DB models
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── database.py       # DB connection setup
│   ├── blockchain.py     # Block + Blockchain (SimpleChain) classes
│   ├── requirements.txt
│   └── .env              # DATABASE_URL (not committed)
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main app, routing, API calls
    │   └── pages/          # Login, Dashboard, Assets, NewAsset, AssetDetails
    ├── package.json
    └── .env               # VITE_API_URL (not committed)
```

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- (Optional) Git

## 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic
```

### Configure the database

By default this project uses **SQLite** — no external database setup required.

Create a `.env` file inside `backend/`:

```
DATABASE_URL=sqlite:///./securechain.db
```

(To use Postgres instead, replace this with your Postgres connection string, e.g. `postgresql://user:password@host:port/dbname`.)

### Run the backend

```bash
uvicorn main:app --reload
```

The API will be running at **http://localhost:8000**.

Verify it's working:
```bash
curl http://localhost:8000/
curl http://localhost:8000/assets
```

Interactive API docs are auto-generated at **http://localhost:8000/docs**.

## 2. Frontend Setup

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```
VITE_API_URL=http://localhost:8000
```

### Run the frontend

```bash
npm run dev
```

The app will be running at **http://localhost:5173** (or whichever port Vite prints).

## 3. Using the App

1. Open the frontend URL in your browser and log in (any credentials work — auth is a demo stub).
2. Go to **Assets** to see the list of registered assets.
3. Click **Add New Asset** to register a new vaccine/equipment batch. Required fields: Asset Name, Asset ID, Manufacturer, Destination.
4. On submission, the asset is written to the database **and** a corresponding event is written to the blockchain (`ASSET_REGISTERED`), producing a cryptographic hash of the record.
5. Click any asset in the list to view its full status page — including its live blockchain verification result and event timeline.

## 4. How the Blockchain Layer Works

- Every asset event (registration, status changes, temperature readings) is hashed and appended as a `Block` to an in-memory, file-persisted chain (`chain.json`).
- Each block stores a hash of the previous block, so altering any past block breaks the chain — this is checked on every status lookup via `blockchain.is_valid()`.
- On every `GET /assets/{id}/status` call, the backend also recomputes the hash of the **current** database record and compares it to the hash originally stored on-chain (`verify_asset()`). If they don't match, the asset is flagged as **not verified** — this is how tampering with the database directly (bypassing the API) gets detected.

### Demoing tamper detection

With the backend running:

```bash
cd backend
sqlite3 securechain.db
```
```sql
UPDATE assets SET manufacturer = 'TAMPERED' WHERE asset_id = 'YOUR-ASSET-ID';
.quit
```

Reload that asset's status page (or `curl http://localhost:8000/assets/YOUR-ASSET-ID/status`) — the `verified` field will flip to `false`, with a `verificationReason` explaining the mismatch.

## Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'fastapi'` | You're not inside the venv — run `source venv/bin/activate` |
| `externally-managed-environment` error on `pip install` | Use a virtual environment (see above); don't install system-wide |
| `sqlalchemy.exc.ArgumentError: Expected string or URL object, got None` | `.env` is missing or `DATABASE_URL` isn't set in `backend/.env` |
| Frontend shows CORS errors in browser console | Confirm the backend is running and `CORSMiddleware` is present in `main.py` |
| `vite: Permission denied` | Run `chmod +x node_modules/.bin/vite`, or delete `node_modules` and run `npm install` again |
| Frontend fetches fail / shows fallback data | Confirm `frontend/.env` has the correct `VITE_API_URL` and the backend is running on that port |

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite (or Postgres), Pydantic
- **Blockchain layer:** Custom Python hash-linked ledger (SHA-256), persisted to `chain.json`
- **Frontend:** React (Vite), Tailwind CSS
