#!/bin/bash
# validate-template.sh
# Validates a template directory has required structure and metadata.
# Ensures info.json + job-definition.json exist and are valid.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo '{"valid": false, "errors": ["Usage: ./validate-template.sh <template-directory>"]}'
  exit 1
fi

TEMPLATE_DIR="$1"
ERRORS=()

# Check directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "{\"valid\": false, \"errors\": [\"Template directory not found: $TEMPLATE_DIR\"]}"
  exit 1
fi

# Check info.json exists
if [ ! -f "$TEMPLATE_DIR/info.json" ]; then
  ERRORS+=("Missing info.json — template has no operational metadata")
else
  # Validate info.json is valid JSON
  if ! jq empty "$TEMPLATE_DIR/info.json" 2>/dev/null; then
    ERRORS+=("info.json: invalid JSON syntax")
  else
    # Check required info.json fields
    for field in id name category framework; do
      VAL=$(jq -r ".$field // empty" "$TEMPLATE_DIR/info.json")
      if [ -z "$VAL" ]; then
        ERRORS+=("info.json: missing required field '$field'")
      fi
    done

    # Check container block
    IMAGE=$(jq -r '.container.image // empty' "$TEMPLATE_DIR/info.json" 2>/dev/null)
    if [ -z "$IMAGE" ]; then
      ERRORS+=("info.json: missing container.image")
    fi

    # Check deployment_compatibility
    COMPAT=$(jq -r '.deployment_compatibility // empty' "$TEMPLATE_DIR/info.json" 2>/dev/null)
    if [ -z "$COMPAT" ] || [ "$COMPAT" = "null" ]; then
      ERRORS+=("info.json: missing deployment_compatibility block")
    fi

    # Check common_failures exists
    FAILURES=$(jq -r '.common_failures // empty' "$TEMPLATE_DIR/info.json" 2>/dev/null)
    if [ -z "$FAILURES" ] || [ "$FAILURES" = "null" ]; then
      ERRORS+=("info.json: missing common_failures array")
    fi
  fi
fi

# Check job-definition.json exists
if [ ! -f "$TEMPLATE_DIR/job-definition.json" ]; then
  ERRORS+=("Missing job-definition.json — template has no base configuration")
else
  # Validate job-definition.json
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  VALIDATION=$("$SCRIPT_DIR/validate-job-definition.sh" "$TEMPLATE_DIR/job-definition.json" 2>/dev/null || true)
  IS_VALID=$(echo "$VALIDATION" | jq -r '.valid // false')
  if [ "$IS_VALID" != "true" ]; then
    JOB_ERRORS=$(echo "$VALIDATION" | jq -r '.errors[]' 2>/dev/null)
    while IFS= read -r err; do
      ERRORS+=("job-definition.json: $err")
    done <<< "$JOB_ERRORS"
  fi
fi

# Output result
if [ ${#ERRORS[@]} -eq 0 ]; then
  TEMPLATE_ID=$(jq -r '.id // "unknown"' "$TEMPLATE_DIR/info.json" 2>/dev/null)
  echo "{\"valid\": true, \"template_id\": \"$TEMPLATE_ID\", \"errors\": []}"
  exit 0
else
  ERROR_JSON=$(printf '%s\n' "${ERRORS[@]}" | jq -R . | jq -s .)
  echo "{\"valid\": false, \"errors\": $ERROR_JSON}"
  exit 1
fi
