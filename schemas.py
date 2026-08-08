from pydantic import BaseModel
from typing import Optional
from datetime import date

class AssetCreate(BaseModel):
    asset_id:str
    name: str
    asset_type :str
    manufacturer : Optional[str] = None
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    origin: Optional[str] = None
    temperature_constraint: Optional[str] = None