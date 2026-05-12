# Analyze Workload Workflow

## Goal
Extract and classify the necessary parameters to build a Nosana deployment.

## Step 1: Identify Workload Category
Classify the user's request into one of the following categories:
1. **LLM Serving (API):** Needs an OpenAI-compatible endpoint (e.g., vLLM).
2. **Chat UI:** Needs a web interface (e.g., Open WebUI + Ollama).
3. **Image/Video Gen:** Stable Diffusion, ComfyUI, etc.
4. **Training/Fine-Tuning:** Axolotl, Jupyter Notebook.
5. **Agent:** ElizaOS, LangChain (Requires stable endpoints).
6. **Custom:** Raw Docker container.

## Step 2: Extract Technical Requirements
For the identified category, determine:
- **Model Name/Size:** e.g., Mistral-7B, Qwen-32B.
- **Quantization:** None (FP16), AWQ/GPTQ (4-bit), GGUF.
- **Port:** What port does the service listen on?
- **Secrets/Env:** Are API keys or tokens required?
- **Data Persistence:** Does it need volumes for weights/data?

## Step 3: Map to Templates
If the workload matches a standard category, load the corresponding template from `templates/` (e.g., `templates/vllm-api.json`). Do not invent a custom configuration if a template exists.

## Next Step
Proceed to `workflows/select-market.md` to determine GPU requirements.
