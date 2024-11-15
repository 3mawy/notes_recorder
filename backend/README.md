### Project Overview
- **Project Name**: Notes Recorder
- **Description**: A [Django](https://docs.djangoproject.com/en/stable/)-based application for managing notes with audio recordings, and related data.

### Setup Instructions

#### Dev Environment Setup
1. **Install Python and Django**
   - Ensure [Python](https://www.python.org/downloads/) and Django are installed.
2. **Create Virtual Environment**
   - Run `python -m venv venv` to create a virtual environment.
   - Activate it using:
     - Windows: `venv\Scripts\activate`
     - macOS/Linux: `source venv/bin/activate`
3. **Install Dependencies**
   - Install required dependencies using: `pip install -r requirements/dev.txt`.
4. **Set Environment Variables**
   - Create a `.env` file in the root directory and set environment variables as per the `README.md` file.

#### Database Setup
1. **Configure PostgreSQL**
   - Set up a PostgreSQL database with the credentials specified in the `.env` file.
2. **Run Migrations**
   - Run migrations to set up the database schema: `python manage.py migrate`.

#### Pre-commit Hooks
- **Install Pre-commit Hooks**: Use `pre-commit install` to maintain code quality and consistency.

### Application Structure

#### Core
- **Settings and Configurations**
  - The core module contains all the settings and configurations for different environments (development, staging, production).

- **Management Commands**
  - Commands for creating apps and managing custom structures.

#### Apps
- **Notes**
  - **Models**: Defines the data structure for notes, including audio recordings.
  - **Views**: Handles CRUD operations for notes (`views/notes_views.py`).
  - **Management Commands**: Command for seeding sample data (`management/commands/seed_notes.py`).
  - **Tests**: Unit tests for note-related functionalities (`tests/test_note_viewset.py`).

- **API Auth**
  - Manages authentication and user-related operations.
  - **Middleware**: 
    - `JWTRefreshMiddleware`: Handles automatic refresh of access tokens using refresh tokens.
    - `CustomAuthentication`: Custom authentication class for JWT in HTTP-only cookies.
    - **Email Templates**: Password setup email templates (`templates/password_setup_email.html`).
    - **Validators**: Custom validators for user data (`validators.py`).

### API Documentation

#### Authentication Endpoints
- **User Registration**: `POST /api/auth/register/` – Allows users to register by providing email, password, etc.
- **Login**: `POST /api/auth/login/` – Authenticate user and provide access tokens. Supports 2FA where enabled.
- **Password Recovery**: `POST /api/auth/password-reset/` – Initiate password reset process.
- **2FA Verification**: `POST /api/auth/verify-2fa/` – Verify 2FA code sent to user email.

#### Notes API
- **List Notes**: `GET /api/notes/` – Retrieve all notes for the authenticated user.
- **Create Note**: `POST /api/notes/` – Create a new note with optional audio recordings.
- **Update Note**: `PUT /api/notes/{id}/` – Update an existing note, including adding or deleting audio recordings.
- **Delete Note**: `DELETE /api/notes/{id}/` – Delete a specific note.

### Testing

#### Unit Tests
- **Location**: Unit tests are located in the `tests` directory of each app.
- **Running Tests**: Execute unit tests using `python manage.py test --settings=src.core.settings.test`.

### Code Quality

#### Linting and Formatting
- **Linting**: Use `flake8` for code linting.
- **Formatting**: Use `black` for consistent code formatting.
- **Code Standards**: Ensure all code adheres to [PEP 8](https://peps.python.org/pep-0008/) standards.

### Deployment

#### Production Setup
1. **Configure Production Settings**
   - Use `src/core/settings/production.py` for production-specific configurations.
2. **WSGI Server**
   - Use a WSGI server like Gunicorn for deployment.
   - Example: `gunicorn src.core.wsgi:application --bind 0.0.0.0:8000`.

