#!/bin/bash

# Path to your SQLite database
DATABASE_PATH="./backend/mydb.sqlite"

# Base port for mapping (3100 is used for the first slave, increment for others)
BASE_PORT=3100

# Start of the docker-compose.yml file
cat <<EOF > docker-compose.yml
version: '3.8'
services:
  master-frontend:
    build:
      context: ./frontend
      args:
        - MODE=master
    ports:
      - '3000:3000'
    volumes:
      - './frontend:/app'
    command: npm run dev
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - '5000:5000'
    volumes:
      - './backend:/app'
    command: npm start
EOF

# Function to add a slave service to the docker-compose.yml file
add_slave_service() {
    local slave_id="$1"
    local port_mapping="$2:3000"

    cat <<EOF >> docker-compose.yml

  slave-frontend-$slave_id:
    build:
      context: ./frontend
      args:
        - MODE=slave
        - SLAVE_ID=$slave_id
    ports:
      - '$port_mapping'
    volumes:
      - './frontend:/app'
    command: npm run dev
    depends_on:
      - backend
EOF
}

# Fetch slave IDs and add to docker-compose.yml
echo "Generating docker-compose.yml file..."
sqlite3 "${DATABASE_PATH}" "SELECT slave_id FROM slave_ids;" | while read -r slave_id; do
    add_slave_service "${slave_id}" "${BASE_PORT}"
    ((BASE_PORT++))
done

echo "docker-compose.yml file generated successfully."
docker-compose up --build
