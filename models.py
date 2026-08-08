from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean , Date
from database import Base
import datetime

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True) # e.g., "VAC-123"
    name = Column(String)                             # e.g., "Covid Vaccine"
    asset_type = Column(String)                       # e.g., "Vaccine" or "Organ"
    status = Column(String, default="In Transit")     # e.g., "Stored", "Delivered"
    
    registration_datetime = Column(DateTime, default=datetime.datetime.utcnow)
    temp_constraint = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    manufacturing_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    origin = Column(String, nullable=True)