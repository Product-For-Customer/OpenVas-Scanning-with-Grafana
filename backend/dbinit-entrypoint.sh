#!/bin/sh
set -e

echo "Waiting for PostgreSQL gvmd database..."
until psql -h /var/run/postgresql -U postgres -d gvmd -c "SELECT 1" >/dev/null 2>&1; do
  echo "pg-gvm is not ready yet..."
  sleep 5
done

echo "Waiting for Greenbone public.tasks table..."
i=0
until psql -h /var/run/postgresql -U postgres -d gvmd -Atc "SELECT COALESCE(to_regclass('public.tasks')::text, '')" | grep -q "tasks"; do
  i=$((i + 1))
  if [ "$i" -ge 120 ]; then
    echo "public.tasks not found after waiting. Running db_init anyway..."
    break
  fi
  echo "public.tasks not ready yet... attempt $i/120"
  sleep 5
done

echo "Running db_init..."
psql -h /var/run/postgresql -U postgres -d gvmd -f /db_init_template.sql
echo "db-init completed."
