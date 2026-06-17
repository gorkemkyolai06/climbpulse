#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4013/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== ClimbPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@verticalpeakclimbing.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/wall-zones" -H "Authorization: Bearer $TOKEN")
assert_status "List Wall Zones" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/climb-sessions" -H "Authorization: Bearer $TOKEN")
assert_status "List Climb Sessions" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/route-settings" -H "Authorization: Bearer $TOKEN")
assert_status "List Route Settings" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/route-rotations" -H "Authorization: Bearer $TOKEN")
assert_status "List Route Rotations" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/gear-inventory" -H "Authorization: Bearer $TOKEN")
assert_status "List Gear Inventory" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rate-tiers" -H "Authorization: Bearer $TOKEN")
assert_status "List Rate Tiers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/climbing-gym" -H "Authorization: Bearer $TOKEN")
assert_status "Climbing Gym Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/route-settings/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Route Settings" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/gear-inventory/available" -H "Authorization: Bearer $TOKEN")
assert_status "Available Gear" 200 "$HTTP_CODE"

CREATE_ZONE=$(curl -s -w "\n%{http_code}" "$API_URL/wall-zones" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Boulder","section":"Test Floor","zoneType":"boulder","maxCapacity":10}')
HTTP_CODE=$(echo "$CREATE_ZONE" | tail -1)
assert_status "Create Wall Zone" 201 "$HTTP_CODE"

ZONE_ID=$(echo "$CREATE_ZONE" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$ZONE_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/wall-zones/$ZONE_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"setting"}')
  assert_status "Update Wall Zone" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/wall-zones/$ZONE_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Wall Zone" 200 "$HTTP_CODE"
fi

CREATE_GEAR=$(curl -s -w "\n%{http_code}" "$API_URL/gear-inventory" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Harness","gearType":"harness","size":"M","rentalPrice":5}')
HTTP_CODE=$(echo "$CREATE_GEAR" | tail -1)
assert_status "Create Gear Item" 201 "$HTTP_CODE"

GEAR_ID=$(echo "$CREATE_GEAR" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$GEAR_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/gear-inventory/$GEAR_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"rented"}')
  assert_status "Update Gear Item" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/gear-inventory/$GEAR_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Gear Item" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
