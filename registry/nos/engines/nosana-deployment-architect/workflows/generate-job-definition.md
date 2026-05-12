# Generate Job Definition Workflow

## Goal
Assemble the full `job-definition.json` using the inputs from the previous workflows.

## Step 1: Base Structure
Every valid job definition MUST have this skeleton:
```json
{
  "version": "0.1",
  "type": "container",
  "meta": {
    "system_requirements": {
      "required_vram": 0
    }
  },
  "ops": []
}
```

## Step 2: Configure Operation (Container Run)
Add an operation to the `ops` array.
- The `id` must be unique.
- The `type` must be `container/run`.
- Set `gpu: true` inside `args` if GPU is needed.

## Step 3: Network & Exposure
- Ensure the application binds to `0.0.0.0`, not `127.0.0.1`.
- Set the `expose` value in `args` to match the application's listening port.
- (Optional) Configure an HTTP health check for production reliability.

## Step 4: Environment Variables & Secrets
- Map environment variables inside `args.env`.
- Use the array syntax `["nosana/secret-name"]` for secrets (do not hardcode API keys).

## Step 5: (Optional) Model Pre-fetching
If deploying a HuggingFace model, use `resources` with S3 target from `models.nosana.io` to bypass download rate limits.

## Next Step
Proceed to `validation/job-definition-rules.md` to ensure no syntax errors.
