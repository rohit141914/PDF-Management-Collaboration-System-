FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y gcc libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy .env file
COPY .env /app/.env

# Copy all project files
COPY . /app

# Collect static files (uses env vars from .env)
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Support dynamic port binding (Render uses $PORT)
CMD gunicorn pdfcollab.wsgi:application --bind 0.0.0.0:${PORT:-8000}

