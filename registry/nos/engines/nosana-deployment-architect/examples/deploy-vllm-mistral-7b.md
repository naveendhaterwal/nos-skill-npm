# Example: Deploy vLLM Mistral-7B

**User Prompt:**
"I want to deploy Mistral-7B-Instruct using vLLM on Nosana. Provide the config."

**Architect Analysis:**
- **Category:** LLM Serving (API).
- **Template:** `vllm-api.json`.
- **Model:** `mistralai/Mistral-7B-Instruct-v0.2`.
- **VRAM Estimate:** FP16 7B model = 14GB + 2GB context = 16GB VRAM.
- **Market:** `gpu-medium` (handles up to 16GB).

**Architect Output:**

Here is your production-ready job definition for Mistral-7B on Nosana. I selected the **gpu-medium** market because the model requires approximately 16GB of VRAM.

```json
{
  "version": "0.1",
  "type": "container",
  "meta": {
    "system_requirements": {
      "required_vram": 16
    }
  },
  "global": {
    "variables": {
      "MODEL": "mistralai/Mistral-7B-Instruct-v0.2",
      "PORT": "8000"
    }
  },
  "ops": [
    {
      "id": "vllm-server",
      "type": "container/run",
      "args": {
        "image": "docker.io/vllm/vllm-openai:v0.10.2",
        "cmd": [
          "--model", "%%global.variables.MODEL%%",
          "--served-model-name", "%%global.variables.MODEL%%",
          "--port", "%%global.variables.PORT%%",
          "--max-model-len", "8192"
        ],
        "gpu": true,
        "expose": {
          "port": 8000,
          "health_checks": [
            {
              "type": "http",
              "method": "POST",
              "path": "/v1/chat/completions",
              "body": "{\"model\":\"%%global.variables.MODEL%%\",\"messages\":[{\"role\":\"user\",\"content\":\"Ready\"}],\"stream\":false}",
              "headers": { "Content-Type": "application/json" },
              "expected_status": 200,
              "continuous": false
            }
          ]
        }
      }
    }
  ]
}
```

### How to deploy:
Save the above JSON as `job.json`, then run:
```bash
nosana job post --market gpu-medium -f job.json --timeout 3600
```

### Important Notes:
- **Port Binding:** The `cmd` automatically uses `8000`, which the container exposes via the FRP proxy.
- **Health Check:** The proxy will block traffic until vLLM successfully responds to a test chat completion request.
