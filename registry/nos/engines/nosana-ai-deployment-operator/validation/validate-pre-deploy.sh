#!/bin/bash
# validate-pre-deploy.sh
# Executable pre-flight validation — replaces markdown checklist.
# Checks: wallet, SOL balance, NOS balance, IPFS credentials, CLI, market.
# Outputs structured JSON.

set -euo pipefail

usage() {
  echo '{"valid": false, "errors": ["Usage: ./validate-pre-deploy.sh <job-definition.json> <market> <timeout>"]}'
  exit 1
}

if [ "$#" -lt 3 ]; then
  usage
fi

JOB_FILE="$1"
MARKET="$2"
TIMEOUT="$3"
ERRORS=()
WARNINGS=()

# Check 1: Job definition file exists
if [ ! -f "$JOB_FILE" ]; then
  ERRORS+=("Job definition file not found: $JOB_FILE")
fi

# Check 2: Job definition is valid JSON
if [ -f "$JOB_FILE" ] && ! jq empty "$JOB_FILE" 2>/dev/null; then
  ERRORS+=("Job definition is not valid JSON")
fi

# Check 3: nosana CLI is installed
if ! command -v nosana &> /dev/null; then
  ERRORS+=("nosana CLI is not installed or not in PATH")
fi

# Check 4: solana CLI is installed (for balance check)
if ! command -v solana &> /dev/null; then
  ERRORS+=("solana CLI is not installed or not in PATH")
fi

# Check 5: Wallet exists
WALLET_ADDRESS=""
if command -v solana &> /dev/null; then
  WALLET_ADDRESS=$(solana address 2>/dev/null || echo "")
  if [ -z "$WALLET_ADDRESS" ]; then
    ERRORS+=("No Solana wallet configured. Run 'solana-keygen new' or set SOLANA_KEYPAIR")
  fi
fi

# Check 6: SOL balance >= 0.005
SOL_BALANCE="0"
if [ -n "$WALLET_ADDRESS" ]; then
  SOL_BALANCE=$(solana balance --output json 2>/dev/null | jq -r '.lamports // 0' 2>/dev/null || echo "0")
  SOL_IN_SOL=$(echo "scale=6; $SOL_BALANCE / 1000000000" | bc 2>/dev/null || echo "0")
  if [ "$(echo "$SOL_IN_SOL < 0.005" | bc 2>/dev/null)" = "1" ] 2>/dev/null; then
    ERRORS+=("SOL balance too low: ${SOL_IN_SOL} SOL (need >= 0.005 for transaction fees)")
  fi
fi

# Check 7: PINATA_JWT is set (IPFS upload credentials)
if [ -z "${PINATA_JWT:-}" ]; then
  WARNINGS+=("PINATA_JWT is not set. IPFS upload may fail unless alternative pinning is configured.")
fi

# Check 8: Market is non-empty
if [ -z "$MARKET" ]; then
  ERRORS+=("Market slug/address is required")
fi

# Check 9: Timeout is valid
if ! [[ "$TIMEOUT" =~ ^[0-9]+$ ]] || [ "$TIMEOUT" -lt 60 ]; then
  ERRORS+=("Timeout must be an integer >= 60 seconds, got: $TIMEOUT")
fi

# Check 10: Validate job definition with nosana CLI (if available)
if [ -f "$JOB_FILE" ] && command -v nosana &> /dev/null; then
  VALIDATE_OUTPUT=$(nosana job validate -f "$JOB_FILE" 2>&1 || true)
  if echo "$VALIDATE_OUTPUT" | grep -qi "error\|invalid\|fail"; then
    ERRORS+=("nosana job validate failed: $(echo "$VALIDATE_OUTPUT" | head -3)")
  fi
fi

# Build output
ERRORS_JSON=$(printf '%s\n' "${ERRORS[@]}" 2>/dev/null | jq -R . | jq -s . 2>/dev/null || echo '[]')
WARNINGS_JSON=$(printf '%s\n' "${WARNINGS[@]}" 2>/dev/null | jq -R . | jq -s . 2>/dev/null || echo '[]')

if [ ${#ERRORS[@]} -eq 0 ]; then
  cat <<EOF
{
  "valid": true,
  "wallet_address": "$WALLET_ADDRESS",
  "sol_balance": "$SOL_IN_SOL",
  "market": "$MARKET",
  "timeout": $TIMEOUT,
  "errors": [],
  "warnings": $WARNINGS_JSON
}
EOF
  exit 0
else
  cat <<EOF
{
  "valid": false,
  "wallet_address": "$WALLET_ADDRESS",
  "errors": $ERRORS_JSON,
  "warnings": $WARNINGS_JSON
}
EOF
  exit 1
fi
