from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class AssetCreate(BaseModel):
    name: str
    asset_id:str
    asset_type :str
    registration_datetime : str 
    temp_constraint: Optional[str] = None
    manufacturer : Optional[str] = None
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    origin: Optional[str] = None
    