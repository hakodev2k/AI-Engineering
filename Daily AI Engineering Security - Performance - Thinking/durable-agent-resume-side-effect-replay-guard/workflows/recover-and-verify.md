# Workflow: Recover and Verify
## Trigger
Diagnosis returns allow.
## Goal
Resume trusted checkpoint without duplicate effects and prove correctness.
## Inputs
Approved resume event, checkpoint, ledger, topology/version.
## Baseline
Record pre-resume checkpoint and external operation states.
## Context
Use validated recovery evidence only.
## Stages
1. Validate workflow/executor identity compatibility.
2. Execute pre-resume hook.
3. Resume exactly once.
4. Restore recorded results for completed operations instead of calling tools again.
5. Bind same operation/idempotency ID for allowed retries.
6. Measure new lineage and operation count.
7. Run tests and independent verification.
## Responsible agent
Recovery owner plus independent verifier.
## Tools
Checkpoint API, ledger, guard, tests.
## Outputs
Recovered checkpoint, ledger comparison, verification decision.
## Checkpoints
Before resume; after first resumed checkpoint; before completion.
## Metrics
Duplicate consequential operations target 0; recovery success; lineage continuity; request match rate.
## Retry policy
One rerun only after deterministic fix; never retry ambiguous consequential operations.
## Stop conditions
Duplicate evidence, changed operation ID, failed lineage, request mismatch.
## Failure path
Pause/escalate; do not weaken safety.
## Verification
Verifier compares before/after ledger and external evidence.
## Definition of Done
Zero duplicate consequential operations, continuous lineage, tests/verifier pass.