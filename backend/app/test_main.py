import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Fixed imports for running from project root or backend directory
from app.database import Base, get_db
from app.main import app
from app import models

# Setup test database (using In-memory SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the database dependency
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Create tables before each test
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after each test
    Base.metadata.drop_all(bind=engine)

def test_create_user_and_login():
    # Test auto-registration during login (as per main.py implementation)
    response = client.post(
        "/token",
        data={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_read_users_me():
    # 1. Login to get token
    login_response = client.post(
        "/token",
        data={"username": "testuser", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]

    # 2. Get user info with token
    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "point" in data

def test_read_items():
    # The startup_populate_db might not run in test or might fail due to missing files
    # Let's check the items list (should be empty in a clean test DB)
    response = client.get("/items")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_view_history():
    # 1. Login
    login_response = client.post(
        "/token",
        data={"username": "testuser", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]

    # 2. Create a dummy music item first (required for ForeignKey)
    db = TestingSessionLocal()
    item = models.MusicItem(
        title="Test CD",
        artist="Test Artist",
        price=10.0,
        description="Test Desc",
        image_url="test.jpg",
        stock=10,
        digital=False,
        category="cd"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    item_id = item.id
    db.close()

    # 3. Post view history
    response = client.post(
        "/views",
        json={"music_item_id": item_id},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["item"]["id"] == item_id

    # 4. Get view history
    response = client.get(
        "/views",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["item"]["title"] == "Test CD"
