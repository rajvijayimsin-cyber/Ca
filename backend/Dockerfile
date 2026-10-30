# Backend Dockerfile for CareNest
FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["sh", "-c", "python -c 'from init_db import init_database; init_database()' 2>/dev/null; uvicorn main:app --host 0.0.0.0 --port 8000"]
