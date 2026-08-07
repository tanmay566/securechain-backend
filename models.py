from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from database import Base
import datetime

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True) # e.g., "VAC-123"
    name = Column(String)                             # e.g., "Covid Vaccine"
    asset_type = Column(String)                       # e.g., "Vaccine" or "Organ"
    status = Column(String, default="In Transit")     # e.g., "Stored", "Delivered"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, index=True)
    temperature = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_violation = Column(Boolean, default=False)