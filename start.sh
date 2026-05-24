#!/bin/bash

if [ "$1" = "prod" ]; then
  echo "Starting in production mode..."
  docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up --build -d
elif [ "$1" = "dev" ]; then
  echo "Starting in development mode..."
  docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml up --build
else
  echo "Usage: ./start.sh [dev|prod]"
fi