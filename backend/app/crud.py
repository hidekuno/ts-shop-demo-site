from sqlalchemy.orm import Session, joinedload
from typing import Optional
from . import models, schemas, auth
import logging
import random
import string

logger = logging.getLogger(__name__)

def generate_order_no() -> str:
    """Generates an Amazon-style order number: XXX-XXXXXXX-XXXXXXX"""
    part1 = ''.join(random.choices(string.digits, k=3))
    part2 = ''.join(random.choices(string.digits, k=7))
    part3 = ''.join(random.choices(string.digits, k=7))
    return f"{part1}-{part2}-{part3}"

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_music_items(db: Session, category: Optional[str] = None) -> list[models.MusicItem]:
    query = db.query(models.MusicItem)
    if category:
        query = query.filter(models.MusicItem.category == category)
    return query.all()

def get_music_item(db: Session, item_id: int) -> Optional[models.MusicItem]:
    return db.query(models.MusicItem).filter(models.MusicItem.id == item_id).first()

def create_order(db: Session, order: schemas.OrderCreate, user_id: int) -> models.Order:
    MAX_RETRIES = 10
    order_no = None
    for _ in range(MAX_RETRIES):
        candidate = generate_order_no()
        if not db.query(models.Order).filter(models.Order.order_no == candidate).first():
            order_no = candidate
            break
    if order_no is None:
        raise RuntimeError("Failed to generate a unique order number")

    db_order = models.Order(
        order_no=order_no,
        user_id=user_id,
        total=order.total,
        payment=order.payment
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Batch-fetch all items to avoid N+1 queries
    item_ids = [d.music_item_id for d in order.detail]
    item_map = {
        item.id: item
        for item in db.query(models.MusicItem).filter(models.MusicItem.id.in_(item_ids)).all()
    }

    for detail in order.detail:
        db_detail = models.OrderDetail(
            order_id=db_order.id,
            music_item_id=detail.music_item_id,
            qty=detail.qty
        )
        db.add(db_detail)
        item = item_map.get(detail.music_item_id)
        if item:
            item.stock -= detail.qty

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        if order.payment < order.total:
            user.point -= int(order.total - order.payment)
        else:
            user.point += int(order.total * 0.1)

    db.commit()
    db.refresh(db_order)
    logger.info("Order created: %s for user_id=%d", order_no, user_id)
    return db_order

def get_orders_by_user(db: Session, user_id: int) -> list[models.Order]:
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == user_id)
        .options(joinedload(models.Order.detail).joinedload(models.OrderDetail.item))
        .order_by(models.Order.order_datetime.desc())
        .all()
    )

def create_viewed_item(db: Session, viewed: schemas.ViewedItemCreate, user_id: int) -> models.ViewedItem:
    db_viewed = models.ViewedItem(
        user_id=user_id,
        music_item_id=viewed.music_item_id
    )
    db.add(db_viewed)
    db.commit()
    db.refresh(db_viewed)
    return db_viewed

def get_viewed_items_by_user(db: Session, user_id: int) -> list[models.ViewedItem]:
    return (
        db.query(models.ViewedItem)
        .filter(models.ViewedItem.user_id == user_id)
        .order_by(models.ViewedItem.viewed_datetime.desc())
        .limit(10)
        .all()
    )
