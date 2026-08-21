from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class AssetCreate(BaseModel):
    name: str
    full_name: Optional[str] = None
    asset_id: str
    batch_number: Optional[str] = None
    category: str
    manufacturer: str
    manufacturing_address: Optional[str] = None
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    storage_requirement: Optional[str] = None
    quantity: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    transport_mode: Optional[str] = None
    vehicle_number: Optional[str] = None
    driver: Optional[str] = None
    dispatch_date: Optional[str] = None
    expected_delivery: Optional[str] = None
    status: Optional[str] = "Registered"


class EventCreate(BaseModel):
    event_type: str
    org: str
    detail: dict = Field(default_factory=dict)


class TempReading(BaseModel):
    temperature: float


class VaccinationRegister(BaseModel):
    full_name: str
    phone: str
    asset_id: str
    hospital: Optional[str] = "VITALChain Hospital"


class PaymentOrderCreate(BaseModel):
    asset_id: Optional[str] = None
    amount_usdc: str = "0.01"
    recipient: Optional[str] = None
    network: Optional[str] = None


class PaymentReceipt(BaseModel):
    transaction_hash: Optional[str] = None
    payer: Optional[str] = None
    network: Optional[str] = None
    success: bool = True
    raw: Optional[dict] = None


class RevocationCreate(BaseModel):
    reason: str = Field(min_length=3, max_length=500)
    revoked_by: Optional[str] = "VITALChain Hospital"
