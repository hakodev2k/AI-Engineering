# Workflow: Diagnose Resume Risk
## Trigger
Resume after crash, executor failure, redeploy, or HITL pause.
## Goal
Establish replay safety before consequential re-execution.
## Inputs
Checkpoint metadata, ledger, acknowledgements, pending request state.
## Baseline
Capture last durable checkpoint, expected parent, pending request ID, consequential operations since checkpoint.
## Context
Use only evidence relevant to interrupted execution.
## Stages
1. Observe persisted state/evidence.
2. Measure stable-ID/evidence coverage.
3. Diagnose replay window.
4. Form one hypothesis per ambiguous operation.
5. Run `scripts/resume_guard.py`.
6. Read-only reconcile and re-evaluate if needed; maximum 2 revisions.
7. Independent verification.
## Responsible agent
Recovery investigator; Resume Verifier final checkpoint.
## Tools
Checkpoint reader, logs, read-only external status, deterministic guard.
## Outputs
Decision, evidence bundle, classified operations.
## Checkpoints
After baseline; after reconciliation; before resume.
## Metrics
Stable-ID coverage, ambiguity count, lineage validity, request integrity.
## Retry policy
Maximum 2 revisions.
## Stop conditions
Irreversible ambiguity, broken lineage, request mismatch, unavailable evidence, exhausted retries.
## Failure path
Keep paused; reconcile manually or start safe branch.
## Verification
Independent verifier reproduces decision.
## Definition of Done
No unresolved consequential ambiguity; guard/reviewer agree; evidence retained.