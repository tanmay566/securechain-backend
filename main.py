from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import engine, get_db

# Create the database tables in Postgres
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "SecureChain API is connected to Postgres!"}

# Test route to create a new asset
@app.post("/create-asset/")
def create_asset(asset_id: str, name: str, asset_type: str, db: Session = Depends(get_db)):
    new_asset = models.Asset(asset_id=asset_id, name=name, asset_type=asset_type)
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset