from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text
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


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(Integer, primary_key=True, index=True)
    vaccination_id = Column(String, unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    asset_id = Column(String, ForeignKey("assets.asset_id"), nullable=False, index=True)
    hospital = Column(String, nullable=True)
    status = Column(String, default="Registered")
    blockchain_hash = Column(String, nullable=True)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)


class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True, nullable=False)
    asset_id = Column(String, nullable=True, index=True)
    amount_usdc = Column(String, nullable=False)
    recipient = Column(String, nullable=True)
    network = Column(String, nullable=True)
    status = Column(String, default="PENDING")
    transaction_hash = Column(String, nullable=True)
    payer = Column(String, nullable=True)
    receipt_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    paid_at = Column(DateTime, nullable=True)


class AssetRevocation(Base):
    __tablename__ = "asset_revocations"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, ForeignKey("assets.asset_id"), unique=True, nullable=False, index=True)
    reason = Column(String, nullable=False)
    revoked_at = Column(DateTime, default=datetime.datetime.utcnow)
    revoked_by = Column(String, nullable=True)
