# Workflow: Baseline and Compact
## Trigger
Context utilization approaches threshold or measured token cost/latency requires reduction.
## Goal
Create smaller context while preserving current-task correctness.
## Inputs
Assembled context, provider token telemetry, required-item inventory, retrieval system.
## Baseline
Record input tokens, output budget, component sizes, required items, recent user request, security/approval constraints, completed-work evidence.
## Context
Classify critical-inline, critical-retrievable, compressible, evictable.
## Stages
1. Measure baseline.
2. Diagnose dominant token components/duplicates.
3. Form one safe-removal hypothesis.
4. Verify retrieval references before eviction.
5. Compact.
6. Measure provider-reported after tokens.
7. Run `scripts/compaction_guard.py`.
8. If not improved, re-evaluate; maximum 2 revised attempts.
9. Hand to Context Verifier.
## Responsible agent
Context optimizer; independent verifier at final checkpoint.
## Tools
Provider telemetry, context profiler, retrieval checker, deterministic guard.
## Outputs
Snapshot, guard decision, before/after metrics, retention evidence.
## Checkpoints
Before eviction; after compaction; before acceptance.
## Metrics
Tokens/task, reduction ratio, retained-required rate, duplicate ratio, retrieval coverage, quality regression.
## Retry policy
Maximum 2 revised compactions.
## Stop conditions
Critical loss, unverified retrieval, exhausted retries, or no measurable savings where required.
## Failure path
Retain known-good context or fresh explicit handoff; never weaken correctness.
## Verification
Context Verifier reproduces guard and checks representative requirements.
## Definition of Done
Token metrics and required-context integrity independently pass.