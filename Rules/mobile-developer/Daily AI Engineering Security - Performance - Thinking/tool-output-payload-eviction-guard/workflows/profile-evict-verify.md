# Workflow: Profile → Evict → Verify

## Trigger
Large tool result, projected utilization >=70%, repeated payload hash, or pre-dispatch budget hook.

## Goal
Reduce retained request size before overflow without losing task-critical data.

## Inputs
Current session snapshot, tool outputs, provider byte/context limits, payload policy.

## Baseline
Record total serialized bytes, estimated tokens, largest five payloads, duplicate bytes, and current task result quality/test status.

## Stages
1. Observe — Context Budget Auditor captures baseline.
2. Diagnose — classify large payloads and locate duplicates/repeated binary content.
3. Hypothesis — estimate savings from dedupe/externalization/eviction.
4. Implement — externalize referenceable payloads, retain hashes/previews, protect exact-round-trip data.
5. Measure again — rerun profiler.
6. Verify — dereference protected payloads and hash-check them; rerun task-level tests/evaluation.
7. Complete — emit before/after metrics and retained-risk record.

## Responsible agent
Context Budget Auditor verifies; the host/orchestrator performs retention changes.

## Tools
`scripts/payload_profiler.py`, artifact store, SHA-256, task-specific tests.

## Outputs
Baseline JSON, optimized JSON, payload references, verification report.

## Checkpoints
Before eviction classification exists; before dispatch projected hard-limit utilization is below 90%; before completion task quality has not regressed and exact references hash-match.

## Metrics
Serialized bytes/request, estimated tokens/request, duplicate bytes, externalized bytes, task success/regression rate.

## Retry policy
At most two remediation cycles. Each cycle must change a diagnosed cause.

## Stop conditions
Stop on hash mismatch, unsafe secret storage, missing exact-data consumer support, or no measurable reduction after two cycles.

## Failure path
Preserve raw data outside model history where safe, checkpoint the task, emit BLOCK with evidence, and require operator intervention/session restart rather than sending an oversized request.

## Definition of Done
Measured request size is below thresholds, exact data is recoverable, task tests/evaluation pass, before/after metrics exist, and independent audit returns PASS.