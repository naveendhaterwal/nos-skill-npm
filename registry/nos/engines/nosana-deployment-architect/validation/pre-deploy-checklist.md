# Pre-Deploy Checklist

Before running `nosana job post`, confirm the environment is ready. Present this checklist to the user if they intend to deploy manually.

1. **CLI Version:** Ensure `@nosana/cli` is up to date (`npm list -g @nosana/cli`).
2. **Solana Wallet:** Ensure `~/.nosana/nosana_key.json` exists and is funded.
   - Run `solana balance` (needs > 0.005 SOL for transaction fees).
3. **NOS Tokens:** Ensure the wallet has enough NOS tokens for the market.
   - Run `spl-token balance nos...`
   - Formula: `(jobPrice / 1_000_000) * timeout_seconds`.
4. **IPFS Auth:** Ensure `PINATA_JWT` environment variable is set for IPFS pinning.
5. **Market:** Ensure the selected market matches the network (`devnet` vs `mainnet`). Run `nosana market list`.
