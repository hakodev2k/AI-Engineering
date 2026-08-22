# Workflow: Deduplicate and Verify

## Trigger
Duplicate calls appear in one model turn or duplicate execution rate exceeds 1%.

## Goal
Reduce redundant execution with zero known false collapses.

## Inputs
Tool call traces, schemas, policy, latency/cost telemetry.

## Baseline
Measure calls/turn, duplicate groups/turn, tool latency, side-effect duplicate incidents over a representative sample.

## Stages
1. **Observe** — collect finalized tool-call arrays without changing execution.
2. **Measure** — compute duplicate candidates using canonical signatures.
3. **Diagnose** — determine whether duplicates originate from model generation, streaming reconstruction, middleware, or replay.
4. **Hypothesize** — specify which tools are safe to collapse and why.
5. **Implement** — configure policy and integrate `scripts/dedupe_tool_calls.py` before execution.
6. **Measure again** — dry-run against captured traces, then controlled enforcement.
7. **Verify** — Tool Call Verifier checks false-collapse fixtures and metrics.

## Responsible agent
Implementation: agent/platform engineer. Verification: `subagents/tool-call-verifier.md`.

## Tools
Trace export, deterministic Python script, unit tests, framework telemetry.

## Outputs
Baseline, policy, decision reports, test results, before/after metrics.

## Checkpoints
- C1: schemas valid and tool semantics classified
- C2: dry-run zero false collapses
- C3: enforcement reduces duplicate executions
- C4: independent verification passes

## Metrics
Duplicate execution ratio, calls/logical operation, p95 tool-stage latency, cost per task, false-collapse count.

## Retry policy
At most 2 correction cycles: one canonicalization/policy correction and one integration correction.

## Stop conditions
Stop and escalate if any destructive operation is incorrectly collapsed, if policy semantics are unknown, or after 2 failed correction cycles.

## Failure path
Disable enforcement for affected tool, revert it to `review`, preserve logs, and escalate. Never relax authorization to restore throughput.

## Verification
Replay representative and adversarial fixtures; compare before/after decisions and metrics.

## Definition of Done
Evidence documented, baseline stored, policy implemented, tests pass, duplicate calls reduced, zero known false collapses, risks documented, and verifier approves.
