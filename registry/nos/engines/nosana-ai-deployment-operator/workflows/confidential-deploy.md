# Confidential Deployment Workflow

## Goal
Deploy a job where the definition is hidden from the public IPFS gateway and delivered directly to the executing node via P2P.

## Step 1: Ensure Prerequisites
Confidential jobs require the `logistics` block in the job definition:
```json
"logistics": {
  "send": { "type": "api-listen", "args": {} },
  "receive": { "type": "api-listen", "args": {} }
}
```

## Step 2: Post the Job Confidentially
Use the `--confidential` flag.
```bash
nosana job post --market <market-slug> -f <job.json> --timeout 3600 --confidential
```

## Step 3: Serve the Job
Unlike normal jobs, confidential jobs require the poster's CLI to stay open to deliver the job payload to the node once it claims the job.
```bash
nosana job serve
```
*The `serve` command listens for the node's P2P request and securely transmits the encrypted job definition.*
