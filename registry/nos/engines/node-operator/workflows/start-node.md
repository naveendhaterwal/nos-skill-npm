# Start Node Workflow

## Goal
Start the `nosana node` process to connect to a market and begin claiming jobs.

## Step 1: Market Selection
Determine which market the user's GPU qualifies for.
- 8GB VRAM: `gpu-micro`
- 16GB VRAM: `gpu-medium`
- 24GB VRAM: `gpu-large`

## Step 2: Container Runtime Selection
- **Linux:** Recommend Podman (`--provider podman`).
- **Windows (WSL) / Ubuntu:** Recommend Docker (`--provider docker`).

## Step 3: Construct Command
Generate the command for the user:
```bash
nosana node start <market-slug> --provider <docker-or-podman>
```

## Step 4: Staking Requirement (Mainnet)
If running on Mainnet, remind the user that they must stake NOS tokens to join a market.
Use `nosana market get <market-slug>` to check the `Node Stake Minimum`.
