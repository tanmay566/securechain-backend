from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class AssetCreate(BaseModel):
    name: str
    asset_id:str
    asset_type :str
    registration_datetime : str 
    temp_constraint: Optional[Temp_constraint] 
    manufacturer : Optional[str] = None
    manufacturing_date: Optional[date] = None
    expiry: Optional[date] = None
    origin: Optional[str] = None

class Temp_constraint(BaseModel):
    min_temp = float
    max_temp = float
    
    