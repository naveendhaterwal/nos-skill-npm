# Node Health Checklist

Before advising a user to run `nosana node start`, ensure their environment is healthy.

1. **GPU Availability:** User must have an NVIDIA GPU. Run `nvidia-smi` to verify.
2. **Container Runtime:** `podman` or `docker` must be installed.
3. **Wallet Balance:** The node's wallet needs a small amount of SOL for transaction fees (claiming jobs and submitting results).
4. **Market Existence:** The specified market slug must be valid on the selected network.
5. **Disk Space:** Pulling large AI models requires significant disk space. Ensure the machine has at least 50GB free.
