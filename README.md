# Notes Recorder

A full-stack application built with a React frontend and a Django backend, designed for efficient note management with support for audio recordings. The project uses Redux Toolkit and RTK Query for state management and includes robust API integration and secure authentication features.

## Getting Started

### Prerequisites
- **Docker**: Ensure you have Docker and Docker Compose installed on your system.

### Installation

1. **Build and Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

    - This will set up both the frontend and backend services along with a PostgreSQL database.

### Project Structure

- **Frontend**: A React application using Redux Toolkit and RTK Query for state management.
    - Located in the `frontend` directory.
- **Backend**: A Django application using Django REST Framework for API management.
    - Located in the `backend` directory.
- **Database**: PostgreSQL, configured via Docker Compose.

## Development

### Frontend Development
For local frontend development:
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
For local backend development:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements/dev.txt
python manage.py runserver
```

## API Documentation

API documentation is available at `http://localhost:8000/api/docs` when running in development mode.

## Testing

### Backend
Run tests for the backend:
```bash
cd backend
python manage.py test
```

## Code Quality

### Linting and Formatting
- **Frontend**: Use `eslint` and `prettier`.
- **Backend**: Use `flake8` and `black`.

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
flake8
black .
```
# notes_recorder
