# Full Deployment Flow Orchestration

This file is a human-readable summary of the execution pipeline.
The authoritative machine-readable DAG is: `workflow-engine/orchestration-dag.yaml`

## Pipeline Execution Order

```
┌─────────────────────────┐
│   1. classify_workload  │ → contracts/workload-classification.schema.json
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌──────────┐  ┌──────────────┐
│ 2. est.  │  │ 3. select    │
│   vram   │  │   template   │
└────┬─────┘  └──────┬───────┘
     │               │
     ▼               ▼
┌──────────┐  ┌──────────────┐
│ 4. select│  │ 5. configure │
│  market  │  │  healthcheck │
└────┬─────┘  └──────┬───────┘
     │               │
     └───────┬───────┘
             ▼
┌─────────────────────────┐
│ 6. generate_job_def     │ → Nosana job-definition.json
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 7. validate_definition  │ → validation/validate-job-definition.sh
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌──────────┐  ┌──────────────┐
│ 8. pred. │  │ 9. select    │
│ failures │  │   strategy   │
└────┬─────┘  └──────┬───────┘
     │               │
     └───────┬───────┘
             ▼
┌─────────────────────────┐
│ 10. assemble_plan       │ → contracts/deployment-plan.schema.json
└─────────────────────────┘
```

## Boundary: What happens AFTER this pipeline

The assembled `deployment-plan.schema.json` is handed off to:
- **nosana-ai-deployment-operator** — if strategy is SIMPLE (one-shot CLI execution)
- **nosana-persistent-service-operator** — if strategy is INFINITE/SCHEDULED (deployment-manager API)

The architect does NOT execute. The architect compiles plans.
