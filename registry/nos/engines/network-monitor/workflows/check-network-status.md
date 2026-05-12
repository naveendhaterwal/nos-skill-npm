# Check Network Status Workflow

## Goal
Retrieve a comprehensive list of all active markets on the Nosana network.

## Step 1: Query the CLI
Run the standard CLI command to list markets:
```bash
nosana market list
```

## Step 2: Parse Output
The output will show:
- **Address:** The Solana public key of the market.
- **Job Price:** The cost in NOS per second of execution.
- **Queue:** Number of jobs waiting.
- **Type / Slug:** The human-readable name (e.g., `gpu-micro`, `gpu-medium`).

## Step 3: API Alternative
If the CLI is unavailable, query the Nosana Explorer API directly:
```bash
curl -s https://explorer-api.nosana.io/api/markets | jq '.'
```

## Step 4: Report
Provide the user with a formatted table of active markets, highlighting the cheapest and most expensive options.
