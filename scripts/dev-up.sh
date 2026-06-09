#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "==> [1/4] Starting infrastructure (MySQL / Redis / Nacos)..."
docker compose up -d

echo "==> [2/4] Waiting for MySQL to be ready..."
for i in {1..30}; do
  if docker exec shucha-mysql mysqladmin ping -h localhost -uroot -pshucha_root_2026 --silent 2>/dev/null; then
    echo "    MySQL ready"
    break
  fi
  sleep 2
  if [ $i -eq 30 ]; then
    echo "    ERROR: MySQL not ready after 60s"
    exit 1
  fi
done

echo "==> [3/4] Initializing DB schema..."
docker exec -i shucha-mysql mysql -uroot -pshucha_root_2026 shucha < backend/shucha-query/src/main/resources/db/schema.sql
echo "    Schema initialized"

echo ""
echo "==> [4/4] Next steps (run in separate terminals):"
echo ""
echo "  # Terminal 1 - Gateway (port 9001)"
echo "  cd backend && mvn spring-boot:run -pl shucha-gateway"
echo ""
echo "  # Terminal 2 - Query service (port 9002)"
echo "  cd backend && mvn spring-boot:run -pl shucha-query"
echo ""
echo "  # Terminal 3 - Auth service (port 9003)"
echo "  cd backend && mvn spring-boot:run -pl shucha-auth"
echo ""
echo "  # Terminal 4 - User service (port 9004)"
echo "  cd backend && mvn spring-boot:run -pl shucha-user"
echo ""
echo "  # Terminal 5 - Frontend (port 9000)"
echo "  cd frontend && npm install && npm run dev:h5"
echo ""
echo "  Then open http://localhost:9000"
