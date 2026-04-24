from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import logging
import os
from contextlib import asynccontextmanager

from . import crud, models, schemas, auth
from .database import engine, get_db

logger = logging.getLogger(__name__)

def populate_db(db: Session):
    if db.query(models.MusicItem).count() == 0:
        # Seed data from JSON files
        public_path = "/app/frontend_public" # This will be mounted or copied in Docker
        categories = ["cd", "lp", "mp3"]
        for cat in categories:
            file_path = f"{public_path}/{cat}.json"
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    data = json.load(f)
                    for item in data:
                        db_item = models.MusicItem(
                            title=item["title"],
                            artist=item["artist"],
                            price=item["price"],
                            description=item["description"],
                            image_url=item["image_url"],
                            stock=item["stock"],
                            digital=item["digital"],
                            category=cat
                        )
                        db.add(db_item)
        db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and populate DB
    models.Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        populate_db(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Music Shop API",
    description="API for CD/LP/MP3 music shop demo",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except auth.JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> schemas.Token:
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password):
        if not user:
            user = crud.create_user(db, schemas.UserCreate(username=form_data.username, password=form_data.password))
        else:
            logger.warning("Failed login attempt for user: %s", form_data.username)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
    logger.info("User logged in: %s", user.username)
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)) -> models.User:
    return current_user

@app.get("/items", response_model=List[schemas.MusicItem])
def read_items(category: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_music_items(db, category=category)

@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_order(db=db, order=order, user_id=current_user.id)

@app.get("/orders", response_model=List[schemas.Order])
def read_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_orders_by_user(db=db, user_id=current_user.id)

@app.post("/views", response_model=schemas.ViewedItem)
def create_viewed_item(viewed: schemas.ViewedItemCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_viewed_item(db=db, viewed=viewed, user_id=current_user.id)

@app.get("/views", response_model=List[schemas.ViewedItem])
def read_viewed_items(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_viewed_items_by_user(db=db, user_id=current_user.id)
