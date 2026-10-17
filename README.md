# VitalChain

A blockchain-based healthcare asset tracking and verification system for vaccines and medical equipment. Combines a FastAPI backend with a custom hash-linked ledger (`SimpleChain`) for tamper-evident event logging.

> This project is a fork of [tanmay566/securechain-backend](https://github.com/tanmay566/securechain-backend), originally built for a hackathon by us together.

## What It Does

- Registers healthcare assets (vaccines, equipment) with a unique digital identity
- Logs every lifecycle event (registration, transport, temperature readings, delivery) as a cryptographically hash-linked block
- Detects tampering: if data is altered in the database after the fact, re-verifying it against its original on-chain hash reveals the mismatch
- Provides a status lookup page showing an asset's current state, full event timeline, and live blockchain verification result

## Project Structure

```
vitalchain/
├── backend/
│   ├── main.py           # FastAPI app, all API endpoints
│   ├── models.py         # SQLAlchemy DB models
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── database.py       # DB connection setup
│   ├── blockchain.py     # Block + Blockchain (SimpleChain) classes
│   ├── requirements.txt
│   └── .env              # DATABASE_URL (not committed)


## Prerequisites

- Python 3.10+

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
DATABASE_URL=sqlite:///./vitalchain.db
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




## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite (or Postgres), Pydantic



## Credits

This project was built collaboratively for a hackathon by:
- **Tanmay** ([@tanmay566](https://github.com/tanmay566)) — original repository, backend, database management, API integration, blockchain
- **Atman** ([@atman-onit](https://github.com/atman-onit)) — backend (FastAPI, SimpleChain implementation, database, API integration


Original repository: [tanmay566/securechain-backend](https://github.com/tanmay566/securechain-backend)
