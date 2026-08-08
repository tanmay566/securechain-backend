from sqlalchemy import Column, Integer, String, DateTime, Date
from database import Base
import datetime

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True)
    name = Column(String)
    full_name = Column(String, nullable=True)
    batch_number = Column(String, nullable=True)
    category = Column(String)
    status = Column(String, default="Registered")
    registration_datetime = Column(DateTime, default=datetime.datetime.utcnow)

    manufacturer = Column(String, nullable=True)
    manufacturing_address = Column(String, nullable=True)
    manufacturing_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)

    storage_requirement = Column(String, nullable=True)
    quantity = Column(String, nullable=True)

    origin = Column(String, nullable=True)
    destination = Column(String, nullable=True)
    transport_mode = Column(String, nullable=True)
    vehicle_number = Column(String, nullable=True)
    driver = Column(String, nullable=True)
    dispatch_date = Column(String, nullable=True)
    expected_delivery = Column(String, nullable=True)

    current_location = Column(String, nullable=True)
    current_custodian = Column(String, nullable=True)