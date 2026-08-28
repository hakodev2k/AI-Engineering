# Workflow: Measure → Optimize → Verify
## Trigger
Image-heavy agent task exceeds or approaches token, latency, inherited-byte, rollout, or descendant budgets.
## Goal
Reduce replay amplification while preserving task correctness.
## Inputs
Representative workload, normalized telemetry, policy, acceptance criteria.
## Baseline
Run the workload unchanged and store the budget-script output.
## Stages
1. **Observe:** identify task-family topology and image-producing turns.
2. **Measure:** record tokens, inherited bytes, rollout bytes, latency and descendants.
3. **Diagnose:** identify whether amplification is inheritance, compaction, retry, or retention driven.
4. **Hypothesize:** write one falsifiable optimization hypothesis.
5. **Implement:** prefer references/selected-image handoffs and bounded descendants.
6. **Measure again:** run the same workload.
7. **Improved?** If no, revise at most twice total. If yes, continue.
8. **Verify:** independent Performance Verifier checks quality and metrics.
## Responsible agent
Implementer owns stages 1–7; Performance Verifier owns stage 8.
## Tools
Budget script, test runner, read-only telemetry collectors.
## Outputs
Baseline/candidate metrics, hypothesis, implementation record, independent verification result.
## Checkpoints
Before implementation; after each candidate run; before any retention/deletion action.
## Metrics
p95 latency, input tokens/turn, inherited image bytes/child, rollout bytes/task family, descendants, quality regression rate.
## Retry policy
Maximum two candidate revisions.
## Stop conditions
Stop on quality regression that cannot be corrected, destructive action without approval, or two failed revisions.
## Failure path
Disable image-heavy fan-out and use a single agent or explicit selected-image handoff.
## Verification
Tests pass and independent before/after comparison supports the claimed improvement.
## Definition of Done
Measured improvement, no critical context loss, bounded fan-out, no unresolved policy violation.
