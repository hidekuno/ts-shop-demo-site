# TS Shop Demo Site

This is a full-stack shopping site demo application, built with React (frontend) and FastAPI (backend).

## Project Structure

- `frontend/`: React application with TypeScript, using Vite.
- `backend/`: FastAPI application with Python and PostgreSQL.
- `docker-compose.yml`: Docker configuration for the backend and PostgreSQL database.

## Technologies Used

### Frontend
- React (TypeScript)
- Vite
- Material UI (MUI)
- Redux-like state management with `useReducer` and `Context API`
- Jest/React Testing Library

### Backend
- Python 3.13
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL
- JWT Authentication
- uv (package management)

## Getting Started

### Prerequisites
- Node.js (v20 or later)
- uv (Python 3.13 is managed by uv — no separate Python installation required)
- Docker and Docker Compose

### Step 1: Start Backend and Database
Use Docker Compose to start the PostgreSQL database and the FastAPI backend server.

```bash
docker compose up --build
```
The backend API will be available at `http://localhost:8000`.

### Common Docker Operations

| Command | Description |
| ------- | ----------- |
| `docker compose up -d` | Start containers in the background. |
| `docker compose down` | Stop and remove containers. |
| `docker compose down -v` | Stop and remove containers and **volumes** (clears the database). |
| `docker compose logs -f` | View real-time output from containers. |
| `docker compose restart` | Restart all services. |
| `docker compose build --no-cache` | Rebuild images from scratch. |

### Step 2: Start Frontend
In a new terminal, install dependencies and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Testing & Linting

### Frontend
```bash
cd frontend
npm run lint  # Run ESLint
npm test      # Run Jest tests
```

### Backend
```bash
cd backend
uv sync                          # Install dependencies (first time only)
uv run pytest app/test_main.py -v  # Run tests (uses SQLite in-memory DB)
```

## Screenshots
![image](https://github.com/hidekuno/jvn/assets/22115777/cb6b71fd-2cdb-497b-95f2-1e34d7994d7e)

---
*Original project based on: [https://github.com/hidekuno/cd-shop-demo-site](https://github.com/hidekuno/cd-shop-demo-site)*
