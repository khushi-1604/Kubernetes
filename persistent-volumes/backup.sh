#!/bin/sh
set -e

DATE=$(date +"%Y-%m-%d-%H-%M-%S")
FILE="backup-$DATE.sql"

# Dump database
pg_dump $POSTGRES_URI > /tmp/$FILE

# Authenticate
gcloud auth activate-service-account --key-file=/var/secrets/google/key.json

# Upload
gsutil cp /tmp/$FILE gs://todo-backups-khushi/
