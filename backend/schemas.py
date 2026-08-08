from pydantic import BaseModel
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