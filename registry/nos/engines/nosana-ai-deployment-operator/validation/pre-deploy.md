# Pre-Deploy Checklist & Validation

Before executing a deployment on behalf of a user, you MUST verify the environment. If any check fails, do not proceed; inform the user how to fix it.

1. **Job Definition Existence:** Ensure the `.json` file specified actually exists and has been validated by the `nosana-deployment-architect`.
2. **IPFS Credentials:** The `PINATA_JWT` must be set in the environment or passed. Test via `echo $PINATA_JWT`.
3. **Wallet Balance:** Check that the wallet has enough SOL and NOS. Use `solana balance` and `spl-token balance`.
4. **Market Address/Slug:** Ensure the requested market is valid.

*If you are an agent without access to the user's local shell (e.g., executing in a restricted container), you must output the exact commands for the user to run themselves.*
