# PDF Management Collaboration System

## Overview

A full-stack web application for managing and collaborating on PDF documents. The project includes a backend built with Django, a frontend built with React, and containerization using Docker.

## Architecture

- **Backend:** Django REST API for handling document management, user authentication, and collaboration logic.
- **Frontend:** React application using Material-UI for the user interface.
- **Containerization:** Docker for containerizing backend.

## Backend (Django)

- Built with Django and Django REST Framework.
- Provides API endpoints for document upload, sharing, deletion, and user management.
- **Database:** PostgreSQL is used as the primary database.
- Ensure you have Python 3.8+ installed.
- Install dependencies from `requirements.txt`:
  ```bash
  pip install -r requirements.txt
  ```
- Run migrations and start the server:
  ```bash
  python manage.py migrate
  python manage.py runserver
  ```

## Frontend (React)

- Built with React and Material-UI.
- Uses Axios for API requests.
- Navigate to the frontend directory and install dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Start the development server:
  ```bash
  npm start
  ```

## Docker

This project includes a Dockerfile to containerize the application. You can build and run the Docker container as follows:

1. **Build the Docker image:**

   ```bash
   docker build -t pdf-management-app .
   ```

2. **Run the Docker container:**
   ```bash
   docker run -p 8000:8000 pdf-management-app
   ```

For a pre-built image, you can pull the Docker Hub image:
[PDF Management App Docker Image](https://hub.docker.com/repository/docker/sadf/abc)

### Docker Compose (Optional)

If you're using Docker Compose, create a `docker-compose.yml` file in the project root with the following content (Note: Only the backend is containerized):

```yaml
version: "3"
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    volumes:
      - .:/app
# Frontend runs locally; navigate to the frontend directory and run 'npm start'
```

Then run:

```bash
docker-compose up --build
```

## Environment Variables

### Backend (.env file)

Set the following keys to run the Django backend:

- `DATABASE_URL`: Connection URL for your database (e.g., PostgreSQL, MySQL).
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of origins allowed to make cross-site HTTP requests.
- `ALLOWED_HOSTS`: Comma-separated hosts/domain names that are valid for this site.
- `SECRET_KEY`: A unique secret key for cryptographic signing in Django.
- `FRONTEND_URL`: URL of the deployed React frontend.
- `DEFAULT_FROM_EMAIL`: Default email address for sending emails.
- `EMAIL_HOST_PASSWORD`: Password for the email host.
- `EMAIL_HOST_USER`: Username for the email host.
- `EMAIL_USE_TLS`: Set to True if TLS should be used for email.
- `EMAIL_PORT`: Port number to use with the email server.
- `EMAIL_HOST`: Host address for your email server.
- `EMAIL_BACKEND`: Django email backend to use (e.g., django.core.mail.backends.smtp.EmailBackend).

Example backend .env:

```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
CORS_ALLOWED_ORIGINS=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:3000
DEFAULT_FROM_EMAIL=no-reply@example.com
EMAIL_HOST_PASSWORD=your_email_password
EMAIL_HOST_USER=your_email_user
EMAIL_USE_TLS=True
EMAIL_PORT=587
EMAIL_HOST=smtp.example.com
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
```

### Frontend (.env file)

Set the following key in your React frontend environment:

- `REACT_APP_BACKEND_API_BASE_URL`: Base URL for your backend API (e.g., http://localhost:8000/api).

Example frontend .env:

```
REACT_APP_BACKEND_API_BASE_URL=http://localhost:8000/api
```
