from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db
from blockchain import blockchain

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "SecureChain API is connected to Postgres!"}

def build_registration_snapshot(asset: models.Asset) -> dict:
    return {
        "asset_id": asset.asset_id,
        "name": asset.name,
        "manufacturer": asset.manufacturer,
        "manufacturing_date": str(asset.manufacturing_date),
        "batch_number": asset.batch_number,
        }

def asset_to_frontend_shape(asset: models.Asset) -> dict:
    return {
        "id": asset.asset_id,
        "assetId": asset.asset_id,
        "name": asset.name,
        "fullName": asset.full_name or asset.name,
        "batchNumber": asset.batch_number or "",
        "category": asset.category,
        "manufacturer": asset.manufacturer or "",
        "manufacturingAddress": asset.manufacturing_address or "",
        "manufacturingDate": str(asset.manufacturing_date) if asset.manufacturing_date else "",
        "expiryDate": str(asset.expiry_date) if asset.expiry_date else "",
        "storageRequirement": asset.storage_requirement or "",
        "quantity": asset.quantity or "",
        "origin": asset.origin or "",
        "destination": asset.destination or "",
        "transportMode": asset.transport_mode or "",
        "vehicleNumber": asset.vehicle_number or "",
        "driver": asset.driver or "",
        "dispatchDate": asset.dispatch_date or "",
        "expectedDelivery": asset.expected_delivery or "",
        "status": asset.status,
        "temperatureRange": asset.storage_requirement or "",
    }


@app.post("/assets/register")
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):

    existing = db.query(models.Asset).filter(models.Asset.asset_id == asset.asset_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset ID '{asset.asset_id}' already exists")

    new_asset = models.Asset(
        asset_id=asset.asset_id,
        name=asset.name,
        full_name=asset.full_name,
        batch_number=asset.batch_number,
        category=asset.category,
        manufacturer=asset.manufacturer,
        manufacturing_address=asset.manufacturing_address,
        manufacturing_date=asset.manufacturing_date,
        expiry_date=asset.expiry_date,
        storage_requirement=asset.storage_requirement,
        quantity=asset.quantity,
        origin=asset.origin,
        destination=asset.destination,
        transport_mode=asset.transport_mode,
        vehicle_number=asset.vehicle_number,
        driver=asset.driver,
        dispatch_date=asset.dispatch_date,
        expected_delivery=asset.expected_delivery,
        status=asset.status or "Registered",
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)



    snapshot = build_registration_snapshot(new_asset)
    blockchain.add_event(new_asset.asset_id, "ASSET_REGISTERED", new_asset.manufacturer or "Unknown", snapshot)
    blockchain.save_chain()

    return asset_to_frontend_shape(new_asset)


@app.get("/assets")
def list_assets(db: Session = Depends(get_db)):
    assets = db.query(models.Asset).all()
    return [asset_to_frontend_shape(a) for a in assets]


@app.get("/assets/{asset_id}/status")
def get_asset_status(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # rebuild the CURRENT snapshot from whatever's in the DB right now
    current_snapshots = {
        "ASSET_REGISTERED": build_registration_snapshot(asset),
    }

    verification = blockchain.verify_asset(asset_id, current_snapshots)

    result = asset_to_frontend_shape(asset)
    result["verified"] = verification["valid"]
    result["verificationReason"] = verification["reason"]
    result["timeline"] = [
        {
            "title": e["data"]["event_type"].replace("_", " ").title(),
            "subtitle": f"Logged by {e['data']['org']}",
            "completed": True,
        }
        for e in blockchain.get_asset_history(asset_id)
    ]
    return result