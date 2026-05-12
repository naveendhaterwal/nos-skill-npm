# Troubleshoot Node Workflow

## Goal
Resolve common issues preventing a node from starting or claiming jobs.

## Step 1: Check Runtime Socket
If the node errors with `connect ENOENT` regarding `podman.sock` or `docker.sock`:
- Ensure the service is running (`systemctl status docker` or `podman machine start`).
- Pass the explicit socket path: `--podman /var/run/docker.sock` (yes, `--podman` flag is used for the socket path even if it's Docker).

## Step 2: Check GPU Passthrough
If jobs crash with `CUDA out of memory` or `no CUDA-capable device is detected`:
- Instruct user to install NVIDIA Container Toolkit.
- Verify with: `docker run --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi`

## Step 3: Delegate to Recovery
If the error is `NodeAlreadyActiveError` or `WSLBlockedError`, consult the `nosana-failure-recovery-operator` for exact fixes.
