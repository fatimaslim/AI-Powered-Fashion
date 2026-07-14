import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Integer, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    try_ons = relationship("TryOnResult", back_populates="user", cascade="all, delete-orphan")

class TryOnResult(Base):
    __tablename__ = "try_on_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    result_url = Column(String, nullable=False)
    model_image_url = Column(String, nullable=True) # Optional original image
    garment_image_url = Column(String, nullable=True) # Optional original garment
    
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="try_ons")
    ai_analysis = relationship("AIAnalysis", back_populates="try_on", uselist=False, cascade="all, delete-orphan")

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    try_on_id = Column(UUID(as_uuid=True), ForeignKey("try_on_results.id"), unique=True, nullable=False)
    
    # Store the complex structured data as JSONB in PostgreSQL
    stylist_data = Column(JSON, nullable=True)
    score_data = Column(JSON, nullable=True)
    outfit_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    try_on = relationship("TryOnResult", back_populates="ai_analysis")
