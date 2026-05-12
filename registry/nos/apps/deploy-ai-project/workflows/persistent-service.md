# Simple-Extend Workflow (SIMPLE Strategy Only)

## Scope
This workflow handles a **single manual timeout extension** for a running job.
It does NOT manage persistent service lifecycles.

> ⚠️ **BOUNDARY**: For services requiring automatic rotation, continuous availability,
> or INFINITE strategy, hand off to `nosana-persistent-service-operator`.
> This operator only handles SIMPLE strategy with at most one manual extend.

## Step 1: Post the Job
Post the job without the `--wait` flag so it runs in the background.
```bash
./scripts/deploy.sh job.json <market> 3600
```
The script outputs a structured JSON receipt with the job address.

## Step 2: Poll for Service URL
Run the polling engine to detect when the service is online:
```bash
./scripts/check-status.sh <job-address> 5 300
```
Watch for `service_urls` in the JSON output.

## Step 3: Extend Timeout (One-Time Only)
If the user needs more time, extend ONCE:
```bash
nosana job extend <job-address> --timeout 3600
```

## HARD BOUNDARY
After the single extension expires, the operator MUST NOT:
- Loop extends
- Implement rotation logic
- Manage continuous service availability

Instead, inform the user:
> "Your service timeout is expiring. For always-on deployments, use the
> `nosana-persistent-service-operator` which manages automatic rotation
> via the deployment-manager INFINITE strategy."
