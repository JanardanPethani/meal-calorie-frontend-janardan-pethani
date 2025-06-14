#!/bin/bash

# Build and start the containers
echo "Building and starting containers..."
docker-compose up -d --build

# Check if docker-compose was successful
if [ $? -eq 0 ]; then
  echo "Containers are starting..."
  echo "Frontend will be available at: http://localhost:3000"
  echo "Backend API will be available at: http://localhost:5000"
else
  echo "Error: Failed to start containers. Please check docker logs for more information."
  exit 1
fi 