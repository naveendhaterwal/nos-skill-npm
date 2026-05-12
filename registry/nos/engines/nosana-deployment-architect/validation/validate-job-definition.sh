#!/bin/bash
# validate-job-definition.sh
# Executable validation of a Nosana job-definition.json.
# Uses jq for structural validation against canonical Nosana schema rules.
# Replaces the markdown-based job-definition-rules.md.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo '{"valid": false, "errors": ["Usage: ./validate-job-definition.sh <job-definition.json>"]}'
  exit 1
fi

JOB_FILE="$1"

if [ ! -f "$JOB_FILE" ]; then
  echo "{\"valid\": false, \"errors\": [\"File not found: $JOB_FILE\"]}"
  exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
  echo '{"valid": false, "errors": ["jq is required but not installed"]}'
  exit 1
fi

# Validate JSON syntax
if ! jq empty "$JOB_FILE" 2>/dev/null; then
  echo '{"valid": false, "errors": ["Invalid JSON syntax"]}'
  exit 1
fi

ERRORS=()

# Rule 1: version must be "0.1"
VERSION=$(jq -r '.version // empty' "$JOB_FILE")
if [ "$VERSION" != "0.1" ]; then
  ERRORS+=("version must be '0.1', got '${VERSION:-missing}'")
fi

# Rule 2: type must be "container"
TYPE=$(jq -r '.type // empty' "$JOB_FILE")
if [ "$TYPE" != "container" ]; then
  ERRORS+=("type must be 'container', got '${TYPE:-missing}'")
fi

# Rule 3: ops must be a non-empty array
OPS_COUNT=$(jq '.ops | length // 0' "$JOB_FILE" 2>/dev/null)
if [ "$OPS_COUNT" -eq 0 ]; then
  ERRORS+=("ops must be a non-empty array")
fi

# Rule 4: Each op must have id, type, and args
for i in $(seq 0 $((OPS_COUNT - 1))); do
  OP_ID=$(jq -r ".ops[$i].id // empty" "$JOB_FILE")
  OP_TYPE=$(jq -r ".ops[$i].type // empty" "$JOB_FILE")
  OP_ARGS=$(jq -r ".ops[$i].args // empty" "$JOB_FILE")

  if [ -z "$OP_ID" ]; then
    ERRORS+=("ops[$i]: missing 'id' field")
  fi
  if [ "$OP_TYPE" != "container/run" ]; then
    ERRORS+=("ops[$i]: type must be 'container/run', got '${OP_TYPE:-missing}'")
  fi
  if [ "$OP_ARGS" = "" ] || [ "$OP_ARGS" = "null" ]; then
    ERRORS+=("ops[$i]: missing 'args' object")
  fi

  # Rule 5: args.image must be a non-empty string
  IMAGE=$(jq -r ".ops[$i].args.image // empty" "$JOB_FILE")
  if [ -z "$IMAGE" ]; then
    ERRORS+=("ops[$i].args: missing 'image' field")
  fi

  # Rule 6: If expose is set, check for 0.0.0.0 binding in cmd
  EXPOSE=$(jq -r ".ops[$i].args.expose // empty" "$JOB_FILE")
  if [ -n "$EXPOSE" ] && [ "$EXPOSE" != "null" ]; then
    # Check if cmd contains 127.0.0.1 or localhost (bad binding)
    CMD_STR=$(jq -r ".ops[$i].args.cmd | if type == \"array\" then join(\" \") else . // \"\" end" "$JOB_FILE" 2>/dev/null)
    if echo "$CMD_STR" | grep -qE '127\.0\.0\.1|localhost'; then
      ERRORS+=("ops[$i].args.cmd: contains 127.0.0.1 or localhost — exposed services MUST bind to 0.0.0.0")
    fi
  fi

  # Rule 7: Secrets must use array syntax
  ENV_KEYS=$(jq -r ".ops[$i].args.env // {} | keys[]" "$JOB_FILE" 2>/dev/null)
  for key in $ENV_KEYS; do
    VAL_TYPE=$(jq -r ".ops[$i].args.env.\"$key\" | type" "$JOB_FILE" 2>/dev/null)
    VAL=$(jq -r ".ops[$i].args.env.\"$key\"" "$JOB_FILE" 2>/dev/null)
    # If value starts with "nosana/" it should be array syntax
    if [ "$VAL_TYPE" = "string" ] && echo "$VAL" | grep -q "^nosana/"; then
      ERRORS+=("ops[$i].args.env.$key: secret reference must use array syntax [\"$VAL\"], not string \"$VAL\"")
    fi
  done

  # Rule 8: If gpu is set, it must be boolean true
  GPU=$(jq -r ".ops[$i].args.gpu // empty" "$JOB_FILE")
  if [ -n "$GPU" ] && [ "$GPU" != "true" ] && [ "$GPU" != "false" ]; then
    ERRORS+=("ops[$i].args.gpu: must be boolean, got '$GPU'")
  fi
done

# Rule 9: meta.system_requirements.required_vram should be set for GPU workloads
HAS_GPU=$(jq '[.ops[].args.gpu // false] | any' "$JOB_FILE" 2>/dev/null)
VRAM=$(jq '.meta.system_requirements.required_vram // 0' "$JOB_FILE" 2>/dev/null)
if [ "$HAS_GPU" = "true" ] && [ "$VRAM" = "0" ]; then
  ERRORS+=("WARNING: GPU enabled but meta.system_requirements.required_vram is 0 or missing")
fi

# Rule 10: Validate global variables interpolation markers
GLOBAL_VARS=$(jq -r '.global.variables // {} | keys[]' "$JOB_FILE" 2>/dev/null)
JOB_STR=$(cat "$JOB_FILE")
for var in $GLOBAL_VARS; do
  MARKER="%%global.variables.${var}%%"
  if ! echo "$JOB_STR" | grep -q "$MARKER"; then
    ERRORS+=("WARNING: global.variables.$var defined but %%global.variables.${var}%% not referenced in ops")
  fi
done

# Output result
if [ ${#ERRORS[@]} -eq 0 ]; then
  echo '{"valid": true, "errors": []}'
  exit 0
else
  # Build JSON array of errors
  ERROR_JSON=$(printf '%s\n' "${ERRORS[@]}" | jq -R . | jq -s .)
  echo "{\"valid\": false, \"errors\": $ERROR_JSON}"
  exit 1
fi
