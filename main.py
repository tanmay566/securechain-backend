from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db

# Create the database tables in Postgres
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "SecureChain API is connected to Postgres!"}

# Test route to create a new asset
@app.post("/assets/")
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):
    
    new_asset = models.Asset(
        asset_id=asset.asset_id,
        name=asset.name,
        asset_type=asset.asset_type,
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return {
        "message": "Asset created successfully",
        "data": new_asset
    }