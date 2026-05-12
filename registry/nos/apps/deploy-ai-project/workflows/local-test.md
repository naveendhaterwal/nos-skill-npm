# Local Testing Workflow

## Goal
Test a job definition locally using the user's local Docker or Podman installation to ensure it works before paying Solana fees.

## Step 1: Prepare Local Environment
Ensure the user has Docker or Podman installed locally and that the CLI is configured to use it.

## Step 2: Run Locally
Use the `nosana node run` command.
```bash
nosana node run <job.json> --provider docker --gpu --verbose
```
*Note: Remove `--gpu` if the user's local machine doesn't have a compatible NVIDIA GPU.*

## Step 3: Validate Behavior
Watch the logs to ensure the container starts, the command executes without errors, and the process exits (for one-shots) or listens on the expected port (for services).
