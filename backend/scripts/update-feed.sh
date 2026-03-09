#!/usr/bin/env bash
set -euo pipefail

COMPOSE_DIR="${OPENVAS_COMPOSE_WORKDIR:-/workspace}"
LOG_DIR="${FEED_UPDATE_LOG_DIR:-/app/logs}"
LOG_FILE="${LOG_DIR}/feed-update.log"

mkdir -p "${LOG_DIR}"

# เขียน log ทั้งหมดทั้ง stdout/stderr ลงไฟล์ + แสดงออกหน้าจอด้วย
exec > >(tee -a "${LOG_FILE}") 2>&1

echo "=================================================="
echo "[$(date -Iseconds)] START feed update automation"
echo "Using compose dir: ${COMPOSE_DIR}"
echo "Using log file: ${LOG_FILE}"

# เช็กว่า compose file มีจริง
if [ ! -f "${COMPOSE_DIR}/docker-compose.yml" ] && [ ! -f "${COMPOSE_DIR}/compose.yml" ]; then
  echo "ERROR: docker-compose.yml or compose.yml not found in ${COMPOSE_DIR}"
  echo "UPDATED=false"
  echo "RESULT_TYPE=failed"
  exit 1
fi

# helper เลือกชื่อ compose file
if [ -f "${COMPOSE_DIR}/docker-compose.yml" ]; then
  COMPOSE_FILE="${COMPOSE_DIR}/docker-compose.yml"
else
  COMPOSE_FILE="${COMPOSE_DIR}/compose.yml"
fi

echo "Resolved compose file: ${COMPOSE_FILE}"

# services feed/data ที่ใช้ refresh
FEED_SERVICES=(
  vulnerability-tests
  notus-data
  scap-data
  cert-bund-data
  dfn-cert-data
  report-formats
  data-objects
)

echo "Feed services: ${FEED_SERVICES[*]}"
echo "Resolving image references from compose config..."

declare -A SERVICE_IMAGE_REF
declare -A IMAGE_ID_BEFORE
declare -A IMAGE_ID_AFTER

for svc in "${FEED_SERVICES[@]}"; do
  img_ref="$(
    docker compose -f "${COMPOSE_FILE}" config 2>/dev/null \
      | awk -v svc="$svc" '
          $0 ~ "^[[:space:]]*"svc":[[:space:]]*$" { in_svc=1; next }
          in_svc && $0 ~ "^[[:space:]]*[a-zA-Z0-9_-]+:[[:space:]]*$" { in_svc=0 }
          in_svc && $0 ~ "^[[:space:]]*image:[[:space:]]*" {
            sub(/^[[:space:]]*image:[[:space:]]*/, "", $0)
            print $0
            exit
          }
        '
  )"

  if [ -z "${img_ref}" ]; then
    echo "WARN: could not resolve image ref for service '${svc}' from compose config"
    SERVICE_IMAGE_REF["$svc"]=""
    IMAGE_ID_BEFORE["$svc"]="unresolved"
    continue
  fi

  SERVICE_IMAGE_REF["$svc"]="${img_ref}"

  before_id="$(docker image inspect "${img_ref}" --format '{{.Id}}' 2>/dev/null || echo 'none')"
  IMAGE_ID_BEFORE["$svc"]="${before_id}"

  echo "Service '${svc}' -> image '${img_ref}' (before: ${before_id})"
done

echo "Checking for feed image updates via docker compose pull..."

PULL_OUTPUT="$(
  docker compose -f "${COMPOSE_FILE}" pull "${FEED_SERVICES[@]}" 2>&1
)"

echo "----- BEGIN docker compose pull output -----"
echo "${PULL_OUTPUT}"
echo "----- END docker compose pull output -----"

LOWER_PULL_OUTPUT="$(printf '%s' "${PULL_OUTPUT}" | tr '[:upper:]' '[:lower:]')"

UPDATED=false
CHANGED_SERVICES=()

echo "Comparing image IDs before/after pull..."

for svc in "${FEED_SERVICES[@]}"; do
  img_ref="${SERVICE_IMAGE_REF[$svc]:-}"

  if [ -z "${img_ref}" ]; then
    echo "WARN: skip ID compare for '${svc}' (image unresolved)"
    continue
  fi

  after_id="$(docker image inspect "${img_ref}" --format '{{.Id}}' 2>/dev/null || echo 'none')"
  IMAGE_ID_AFTER["$svc"]="${after_id}"

  before_id="${IMAGE_ID_BEFORE[$svc]:-none}"

  echo "Service '${svc}' -> before: ${before_id} | after: ${after_id}"

  if [ "${before_id}" != "${after_id}" ]; then
    UPDATED=true
    CHANGED_SERVICES+=("${svc}")
  fi
done

if [ "${UPDATED}" = false ]; then
  if printf '%s' "${LOWER_PULL_OUTPUT}" | grep -qE "downloaded newer image"; then
    echo "Fallback text detection matched: downloaded newer image"
    UPDATED=true
  fi
fi

if [ "${UPDATED}" = false ]; then
  echo "No new feed updates found (all feed images likely up to date)."
  echo "UPDATED=false"
  echo "RESULT_TYPE=no_update"
  echo "[$(date -Iseconds)] FEED CHECK DONE (NO UPDATE)"
  echo "=================================================="
  exit 0
fi

echo "Detected new feed image updates. Refreshing feed/data containers..."

if [ "${#CHANGED_SERVICES[@]}" -gt 0 ]; then
  echo "Changed services by image ID: ${CHANGED_SERVICES[*]}"
fi

echo "Running: docker compose -f ${COMPOSE_FILE} up -d ${FEED_SERVICES[*]}"
docker compose -f "${COMPOSE_FILE}" up -d "${FEED_SERVICES[@]}"

echo "Restarting gvmd/openvas/openvasd to load refreshed feed..."
docker compose -f "${COMPOSE_FILE}" restart gvmd openvas openvasd || true

echo "UPDATED=true"
echo "RESULT_TYPE=updated"
echo "[$(date -Iseconds)] FEED UPDATE AUTOMATION DONE"
echo "=================================================="