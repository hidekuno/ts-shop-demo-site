from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    point = Column(Integer, default=1000)

    orders = relationship("Order", back_populates="owner")
    views = relationship("ViewedItem", back_populates="user")

class MusicItem(Base):
    __tablename__ = "music_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    artist = Column(String(255), nullable=False)
    image_url = Column(Text)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    digital = Column(Boolean, nullable=False)
    category = Column(String(10), nullable=False)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    order_datetime = Column(DateTime(timezone=True), server_default=func.now())
    total = Column(Float, nullable=False)
    payment = Column(Float, nullable=False)

    owner = relationship("User", back_populates="orders")
    detail = relationship("OrderDetail", back_populates="order")

class OrderDetail(Base):
    __tablename__ = "order_details"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    music_item_id = Column(Integer, ForeignKey("music_items.id"))
    qty = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="detail")
    item = relationship("MusicItem")

class ViewedItem(Base):
    __tablename__ = "viewed_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    music_item_id = Column(Integer, ForeignKey("music_items.id"))
    viewed_datetime = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="views")
    item = relationship("MusicItem")
