# Example: Deploy vLLM Service

**User:** "Run the vllm-api.json job I just created."

**Agent Action:**
```bash
nosana job post --market gpu-medium -f vllm-api.json --timeout 3600
```

**Agent Action (Polling):**
```bash
nosana job get <job-address-from-previous-step>
```
*Parses JSON output, looking for `endpoints`.*

**Agent Response:**
"Your vLLM service has been posted and is currently starting up on the network.
- **Job Address:** `<job-address>`
- **Endpoint URL:** `https://xyz123.nos.app` (will become active once the model loads)

If you want to keep this running beyond 1 hour, run `nosana job extend <job-address> --timeout 3600` before it expires."
