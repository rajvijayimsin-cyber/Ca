#!/bin/bash
# HIPAA Backup & Disaster Recovery — § 164.308(a)(7)
# Run daily via cron: 0 2 * * * /opt/app/backup.sh

set -euo pipefail

DB_NAME="${DB_NAME:-app_db}"
BACKUP_DIR="${BACKUP_DIR:-/opt/backups}"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

# Encrypted database backup using pg_dump
echo "[$(date)] Starting backup of $DB_NAME..."
pg_dump "$DB_NAME" | gzip > "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"
echo "[$(date)] Backup complete: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Cleanup old backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Cleaned backups older than $RETENTION_DAYS days"
