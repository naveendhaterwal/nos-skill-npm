# Common Deployment Failures (Prevention)

When generating a deployment plan, proactively warn the user about these common pitfalls:

## 1. Out of Memory (OOM)
- **Cause:** Model parameters + context window exceed GPU VRAM.
- **Prevention:** Ensure the selected market (`system_requirements.required_vram`) aligns with the model size (see `configs/gpu-sizing-table.yaml`). Suggest quantization if on the boundary.

## 2. Service 502 / Connection Refused
- **Cause:** The container is listening on `127.0.0.1` instead of `0.0.0.0`.
- **Prevention:** Explicitly set `--host 0.0.0.0` in the `cmd` args for APIs/web apps.

## 3. Job Stays Queued Indefinitely
- **Cause:** No nodes available on the market, or nodes don't meet `system_requirements`.
- **Prevention:** Don't unnecessarily set high `required_cuda` versions or VRAM if the workload doesn't need it.

## 4. IPFS Hangs
- **Cause:** Missing or invalid `PINATA_JWT`.
- **Prevention:** Include a reminder to set `export PINATA_JWT=...` before deploying.
