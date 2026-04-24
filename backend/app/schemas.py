from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime

class MusicItemBase(BaseModel):
    title: str
    artist: str
    price: float
    description: str
    image_url: str
    stock: int
    digital: bool
    category: str

class MusicItem(MusicItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    point: int
    model_config = ConfigDict(from_attributes=True)

class OrderDetailBase(BaseModel):
    music_item_id: int = Field(..., gt=0)
    qty: int = Field(..., gt=0)

class OrderDetail(OrderDetailBase):
    id: int
    item: MusicItem
    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    total: float = Field(..., ge=0)
    payment: float = Field(..., ge=0)
    detail: List[OrderDetailBase] = Field(..., min_length=1)

class Order(BaseModel):
    id: int
    order_no: str
    order_datetime: datetime
    total: float
    payment: float
    detail: List[OrderDetail]
    model_config = ConfigDict(from_attributes=True)

class ViewedItemCreate(BaseModel):
    music_item_id: int = Field(..., gt=0)

class ViewedItem(BaseModel):
    id: int
    viewed_datetime: datetime
    item: MusicItem
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
