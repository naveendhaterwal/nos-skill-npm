# Select Market & GPU Sizing Workflow

## Goal
Determine the minimum VRAM required and select the most cost-effective Nosana market.

## Step 1: Estimate VRAM
Consult `configs/gpu-sizing-table.yaml`.
- Rule of thumb for FP16 models: `Parameter Count * 2 = VRAM in GB`. Add 20% for context window.
  - Example: 7B model -> 14GB + 2GB = 16GB VRAM.
- Rule of thumb for 4-bit (AWQ/GPTQ): `Parameter Count * 0.7 = VRAM in GB`. Add 20% for context window.
  - Example: 7B model -> 5GB + 2GB = 7GB VRAM.

## Step 2: Select Target Market
Consult `configs/market-selection.yaml` to map the VRAM requirement to a market:
- < 8GB: `gpu-micro` or `gpu-small`
- 8GB - 16GB: `gpu-medium`
- 16GB - 24GB: `gpu-large`
- > 24GB: `gpu-x-large`

## Step 3: Define System Requirements
Add the requirements to the job definition's `meta` block:
```json
"meta": {
  "system_requirements": {
    "required_vram": <estimated_vram>
  }
}
```

## Next Step
Proceed to `workflows/generate-job-definition.md` to assemble the JSON.
