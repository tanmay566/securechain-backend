import json
import os
import re
import uuid
import datetime
from io import BytesIO
from urllib.parse import quote

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
from database import engine, get_db
from blockchain import blockchain
from payments import x402_routes, x402_server, X402_ENABLED, NETWORK, VERIFICATION_PRICE

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VITALChain API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["PAYMENT-RESPONSE", "X-PAYMENT-RESPONSE"],
)

if X402_ENABLED and x402_server:
    from x402.http.middleware.fastapi import PaymentMiddlewareASGI
    app.add_middleware(PaymentMiddlewareASGI, routes=x402_routes, server=x402_server)


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


def build_registration_snapshot(asset: models.Asset) -> dict:
    return {
        "asset_id": asset.asset_id,
        "name": asset.name or "",
        "full_name": asset.full_name or "",
        "manufacturer": asset.manufacturer or "",
        "manufacturing_address": asset.manufacturing_address or "",
        "manufacturing_date": str(asset.manufacturing_date) if asset.manufacturing_date else "",
        "expiry_date": str(asset.expiry_date) if asset.expiry_date else "",
        "batch_number": asset.batch_number or "",
        "category": asset.category or "",
        "storage_requirement": asset.storage_requirement or "",
        "quantity": asset.quantity or "",
        "origin": asset.origin or "",
        "destination": asset.destination or "",
    }


def revocation_to_shape(r: models.AssetRevocation) -> dict:
    return {
        "revoked": True,
        "reason": r.reason,
        "revokedAt": r.revoked_at.isoformat() if r.revoked_at else None,
        "revokedBy": r.revoked_by,
    }


def vaccination_to_shape(v: models.Vaccination, p: models.Patient, asset: models.Asset) -> dict:
    return {
        "id": v.vaccination_id,
        "vaccinationId": v.vaccination_id,
        "patientId": p.id,
        "patientName": p.full_name,
        "patientMobile": p.phone,
        "assetId": asset.asset_id,
        "vaccineName": asset.name,
        "batchNumber": asset.batch_number or "",
        "hospital": v.hospital or "",
        "status": v.status,
        "registeredAt": v.registered_at.isoformat() if v.registered_at else None,
        "blockchainHash": v.blockchain_hash,
    }


@app.get("/")
def home():
    return {
        "message": "VITALChain API is running",
        "x402_enabled": X402_ENABLED,
        "x402_network": NETWORK,
    }


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(func.count(models.Asset.id).select()) if False else None
    return {"ok": True, "database": "connected", "x402_enabled": X402_ENABLED}


@app.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    assets = db.query(models.Asset).all()
    vaccinations = db.query(models.Vaccination).count()
    alerts = sum(1 for e in blockchain.chain if e.data.get("event_type") == "TEMP_VIOLATION_ALERT")
    return {
        "totalAssets": len(assets),
        "administered": vaccinations,
        "inTransit": sum(1 for a in assets if str(a.status).lower() == "in transit"),
        "delivered": sum(1 for a in assets if str(a.status).lower() == "delivered"),
        "temperatureAlerts": alerts,
    }


@app.post("/assets/register", status_code=201)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Asset).filter(models.Asset.asset_id == asset.asset_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset ID '{asset.asset_id}' already exists")

    new_asset = models.Asset(**asset.model_dump())
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    snapshot = build_registration_snapshot(new_asset)
    blockchain.add_event(new_asset.asset_id, "ASSET_REGISTERED", new_asset.manufacturer or "Unknown", snapshot)
    blockchain.save_chain()
    return asset_to_frontend_shape(new_asset)


@app.get("/assets")
def list_assets(db: Session = Depends(get_db)):
    return [asset_to_frontend_shape(a) for a in db.query(models.Asset).order_by(models.Asset.id.desc()).all()]


@app.get("/assets/{asset_id:path}/status")
def get_asset_status(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    current_snapshots = {"ASSET_REGISTERED": build_registration_snapshot(asset)}
    verification = blockchain.verify_asset(asset_id, current_snapshots)

    # Existing demo chains were created with the original compact snapshot.
    # Preserve those records as valid while all newly registered assets use
    # the stronger full snapshot above.
    if not verification["valid"]:
        legacy_snapshot = {
            "ASSET_REGISTERED": {
                "asset_id": asset.asset_id,
                "name": asset.name or "",
                "manufacturer": asset.manufacturer or "",
                "manufacturing_date": str(asset.manufacturing_date) if asset.manufacturing_date else "",
                "batch_number": asset.batch_number or "",
            }
        }
        legacy_verification = blockchain.verify_asset(asset_id, legacy_snapshot)
        if legacy_verification["valid"]:
            verification = {
                "valid": True,
                "reason": "Verified against the legacy registration snapshot.",
            }

    history = blockchain.get_asset_history(asset_id)
    revocation = db.query(models.AssetRevocation).filter(models.AssetRevocation.asset_id == asset_id).first()

    # Extract cold-chain readings from the immutable event log. This keeps the
    # demo simple while making the chart and alert state backend-driven.
    temperature_readings = []
    for e in history:
        event_type = e["data"].get("event_type")
        if event_type in {"TEMP_LOGGED", "TEMP_VIOLATION_ALERT"}:
            detail = e["data"].get("detail") or {}
            if "temperature" in detail:
                temperature_readings.append({
                    "temperature": float(detail["temperature"]),
                    "violation": event_type == "TEMP_VIOLATION_ALERT",
                    "timestamp": e.get("timestamp"),
                    "hash": e.get("hash"),
                })

    # Lifecycle/tamper-friendly audit timeline. The hash shown here is the
    # actual block hash, not a frontend-generated fingerprint.
    timeline = [
        {
            "title": e["data"].get("event_type", "EVENT").replace("_", " ").title(),
            "subtitle": f"Logged by {e['data'].get('org', 'Unknown')}",
            "completed": True,
            "eventType": e["data"].get("event_type"),
            "blockIndex": e.get("index"),
            "timestamp": e.get("timestamp"),
            "hash": e.get("hash"),
            "recordHash": e["data"].get("record_hash"),
        }
        for e in history
    ]

    result = asset_to_frontend_shape(asset)
    result.update({
        "verified": False if revocation else verification["valid"],
        "verificationReason": (f"Asset revoked: {revocation.reason}" if revocation else verification["reason"]),
        "latestHash": history[-1]["hash"] if history else None,
        "timeline": timeline,
        "temperatureReadings": temperature_readings,
        "latestTemperature": temperature_readings[-1]["temperature"] if temperature_readings else None,
        "temperatureViolationCount": sum(1 for r in temperature_readings if r["violation"]),
        "revoked": bool(revocation),
        "revocation": revocation_to_shape(revocation) if revocation else None,
    })
    return result


@app.get("/assets/{asset_id:path}/qr")
def asset_qr(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    import qrcode
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    verify_url = f"{frontend_url.rstrip('/')}/verify-vaccine?assetId={asset.asset_id}"
    image = qrcode.make(verify_url)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png", headers={"Cache-Control": "no-store"})


@app.get("/assets/{asset_id:path}/qr-data")
def asset_qr_data(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return {
        # The complete identifier is the Med ID.
        # Example: zero33/3 identifies vial 3 from batch zero33.
        "medId": asset.asset_id,
        "assetId": asset.asset_id,  # backwards compatibility
        "verifyUrl": f"{frontend_url.rstrip('/')}/verify-vaccine?medId={quote(asset.asset_id, safe='')}",
        "qrUrl": f"/assets/{asset.asset_id}/qr",
    }


@app.post("/assets/{asset_id:path}/events")
def log_event(asset_id: str, event: schemas.EventCreate, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    asset.status = event.event_type.replace("_", " ").title()
    db.commit()
    blockchain.add_event(asset_id, event.event_type, event.org, event.detail)
    blockchain.save_chain()
    return {"message": "Event logged", "event_type": event.event_type, "asset": asset_to_frontend_shape(asset)}


@app.post("/assets/{asset_id:path}/temperature")
def log_temperature(asset_id: str, reading: schemas.TempReading, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    nums = [float(n) for n in re.findall(r"-?\d+(?:\.\d+)?", asset.storage_requirement or "")]
    is_violation = len(nums) >= 2 and (reading.temperature < nums[0] or reading.temperature > nums[1])
    event_type = "TEMP_VIOLATION_ALERT" if is_violation else "TEMP_LOGGED"
    blockchain.add_event(asset_id, event_type, "IoT-Sensor", {"temperature": reading.temperature})
    blockchain.save_chain()
    return {"event_type": event_type, "temperature": reading.temperature, "violation": is_violation}


@app.post("/vaccinations/register")
def register_vaccination(data: schemas.VaccinationRegister, db: Session = Depends(get_db)):
    if not data.full_name.strip() or not re.fullmatch(r"\d{10}", data.phone.strip()):
        raise HTTPException(status_code=422, detail="Valid name and 10-digit mobile number are required")

    asset = db.query(models.Asset).filter(models.Asset.asset_id == data.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Vaccine asset not found")

    revocation = db.query(models.AssetRevocation).filter(models.AssetRevocation.asset_id == asset.asset_id).first()
    if revocation or str(asset.status).lower() == "revoked":
        raise HTTPException(status_code=409, detail=f"This vaccine has been revoked: {revocation.reason if revocation else 'asset is marked revoked'}")

    if str(asset.status).lower() == "administered":
        raise HTTPException(status_code=409, detail="This vaccine has already been registered to a patient")

    existing = db.query(models.Vaccination).filter(models.Vaccination.asset_id == asset.asset_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="This vaccine already has a vaccination record")

    patient = db.query(models.Patient).filter(models.Patient.phone == data.phone.strip()).first()
    if not patient:
        patient = models.Patient(full_name=data.full_name.strip(), phone=data.phone.strip())
        db.add(patient)
        db.flush()
    else:
        patient.full_name = data.full_name.strip()

    vaccination_id = f"VAX-{uuid.uuid4().hex[:10].upper()}"
    asset.status = "Administered"
    vaccination = models.Vaccination(
        vaccination_id=vaccination_id,
        patient_id=patient.id,
        asset_id=asset.asset_id,
        hospital=data.hospital,
        status="Registered",
    )
    db.add(vaccination)
    db.commit()
    db.refresh(vaccination)

    blockchain.add_event(
        asset.asset_id,
        "VACCINATION_REGISTERED",
        data.hospital or "VITALChain Hospital",
        {
            "vaccination_id": vaccination_id,
            "patient_name": patient.full_name,
            "patient_mobile": patient.phone,
            "asset_id": asset.asset_id,
        },
    )
    blockchain.save_chain()
    history = blockchain.get_asset_history(asset.asset_id)
    vaccination.blockchain_hash = history[-1]["hash"] if history else None
    db.commit()

    return {
        "success": True,
        "vaccination": vaccination_to_shape(vaccination, patient, asset),
        "asset": asset_to_frontend_shape(asset),
    }


@app.get("/vaccinations")
def list_vaccinations(db: Session = Depends(get_db)):
    rows = db.query(models.Vaccination).order_by(models.Vaccination.id.desc()).all()
    result = []
    for row in rows:
        patient = db.query(models.Patient).filter(models.Patient.id == row.patient_id).first()
        asset = db.query(models.Asset).filter(models.Asset.asset_id == row.asset_id).first()
        if patient and asset:
            result.append(vaccination_to_shape(row, patient, asset))
    return result


@app.get("/vaccinations/{vaccination_id}")
def get_vaccination(vaccination_id: str, db: Session = Depends(get_db)):
    row = db.query(models.Vaccination).filter(models.Vaccination.vaccination_id == vaccination_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Vaccination not found")
    patient = db.query(models.Patient).filter(models.Patient.id == row.patient_id).first()
    asset = db.query(models.Asset).filter(models.Asset.asset_id == row.asset_id).first()
    return vaccination_to_shape(row, patient, asset)


@app.post("/assets/{asset_id:path}/revoke",status_code=203)
def revoke_asset(asset_id: str, data: schemas.RevocationCreate, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    existing = db.query(models.AssetRevocation).filter(models.AssetRevocation.asset_id == asset_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Asset is already revoked")

    revocation = models.AssetRevocation(
        asset_id=asset_id,
        reason=data.reason.strip(),
        revoked_by=data.revoked_by or "VITALChain Hospital",
    )
    asset.status = "Revoked"
    db.add(revocation)
    db.commit()

    blockchain.add_event(
        asset_id,
        "ASSET_REVOKED",
        data.revoked_by or "VITALChain Hospital",
        {"reason": data.reason.strip(), "revoked_by": data.revoked_by or "VITALChain Hospital"},
    )
    blockchain.save_chain()
    return get_asset_status(asset_id, db)


@app.post("/payments/create",status_code=201)
def create_payment_order(order: schemas.PaymentOrderCreate, db: Session = Depends(get_db)):
    if order.asset_id:
        asset = db.query(models.Asset).filter(models.Asset.asset_id == order.asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")

    order_id = f"VTC-ORD-{uuid.uuid4().hex[:8].upper()}"
    row = models.PaymentOrder(
        order_id=order_id,
        asset_id=order.asset_id,
        amount_usdc=order.amount_usdc,
        recipient=order.recipient,
        network=order.network or NETWORK,
        status="PENDING",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return payment_to_shape(row)


def payment_to_shape(row: models.PaymentOrder) -> dict:
    return {
        "orderId": row.order_id,
        "assetId": row.asset_id,
        "amountUsdc": row.amount_usdc,
        "recipient": row.recipient,
        "network": row.network,
        "status": row.status,
        "transactionHash": row.transaction_hash,
        "payer": row.payer,
        "createdAt": row.created_at.isoformat() if row.created_at else None,
        "paidAt": row.paid_at.isoformat() if row.paid_at else None,
        "x402Enabled": X402_ENABLED,
        "x402Price": VERIFICATION_PRICE,
    }


@app.get("/payments/{order_id}")
def get_payment(order_id: str, db: Session = Depends(get_db)):
    row = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_id == order_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Payment order not found")
    return payment_to_shape(row)


@app.get("/payments/{order_id}/settle")
def settle_payment(order_id: str, db: Session = Depends(get_db)):
    row = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_id == order_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Payment order not found")

    if not X402_ENABLED:
        raise HTTPException(status_code=503, detail="x402 is not configured. Add X402_PAY_TO_ADDRESS to backend/.env")

    row.status = "PAID"
    row.paid_at = datetime.datetime.utcnow()
    db.commit()
    return {"success": True, "order": payment_to_shape(row)}


@app.post("/payments/{order_id}/receipt")
def save_payment_receipt(order_id: str, receipt: schemas.PaymentReceipt, db: Session = Depends(get_db)):
    row = db.query(models.PaymentOrder).filter(models.PaymentOrder.order_id == order_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Payment order not found")
    if not receipt.success:
        row.status = "FAILED"
    else:
        row.status = "PAID"
        row.paid_at = datetime.datetime.utcnow()
        row.transaction_hash = receipt.transaction_hash
        row.payer = receipt.payer
        row.network = receipt.network or row.network
        row.receipt_json = json.dumps(receipt.raw or {})
    db.commit()
    db.refresh(row)
    return payment_to_shape(row)