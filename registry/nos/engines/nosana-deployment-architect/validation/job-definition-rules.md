# Job Definition Validation Rules

Before outputting a job definition, verify it against these strict schema rules:

## Rule 1: Mandatory Top-Level Fields
- `version` MUST exist and equal `"0.1"`.
- `type` MUST exist and equal `"container"`.
- `ops` MUST exist and be a non-empty array.

## Rule 2: Operations Structure
Every object in the `ops` array MUST have:
- `id` (string)
- `type` (must equal `"container/run"`)
- `args` (object)

## Rule 3: Arguments Structure
Inside `args`:
- `image` MUST be provided (string, full registry path recommended).
- If GPU is required, `gpu` MUST be `true` (boolean).
- If exposing a port, the application command MUST bind to `0.0.0.0` (not `127.0.0.1` or `localhost`).
- Health checks MUST have `type: "http"`.

## Rule 4: Secret References
Secrets must be defined as an array containing the path string, NOT a raw string:
- Correct: `"API_KEY": ["nosana/api-key"]`
- Incorrect: `"API_KEY": "nosana/api-key"`
- Incorrect: `"API_KEY": "${nosana/api-key}"`

If any rule fails, regenerate the JSON before presenting it to the user.
