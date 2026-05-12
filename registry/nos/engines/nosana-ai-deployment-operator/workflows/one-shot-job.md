# One-Shot Job Workflow

## Goal
Deploy a job that runs to completion (e.g., a batch training script or data processing task) and download the results.

## Step 1: Post the Job
Use the CLI to post the job and wait for it to complete.
```bash
nosana job post --market <market-slug> -f <job.json> --timeout <seconds> --wait
```
*Note: The `--wait` flag tells the CLI to block and stream logs until the job hits COMPLETED or STOPPED.*

## Step 2: Download Results
Once completed, download any artifacts generated in the `output` directory of the container.
```bash
nosana job get <job-address> --download ./results
```

## Step 3: Handle Failures
If the job stops prematurely, advise the user to consult the `nosana-failure-recovery-operator` or check `recovery/deploy-failures.md`.
