# Workflow: Measure, Diagnose, Guard, Verify

## Trigger
Repeated tool-search activity, rising context without new capability, or latency/cost regression.

## Goal
Bound successful-but-stagnant discovery loops while preserving legitimate tool discovery.

## Inputs
Representative workload, raw trace, baseline metrics, task completion criteria.

## Baseline
Run without the new guard. Record search calls, total calls, tokens/context, elapsed time, completion and quality.

## Stages
1. Observe — Performance Investigator captures trace and facts.
2. Measure — compute baseline metrics.
3. Diagnose — classify failed retry, exact duplicate, or successful stagnation; form at most 2 hypotheses.
4. Hypothesize — define the expected effect of one threshold/guard.
5. Implement — add deterministic progress ledger/budget; do not change unrelated behavior.
6. Measure again — run the same workload and collect identical metrics.
7. Decision checkpoint — if no measurable improvement, re-evaluate once; maximum 2 optimization attempts.
8. Verify — independent Verification Agent runs tests and checks quality/completion.

## Responsible agents
Performance Investigator for stages 1-6; Verification Agent for stage 8.

## Tools
Trace collector, `scripts/tool_loop_guard.py`, unit tests, provider token/latency telemetry.

## Outputs
Baseline report, diagnosis, guarded trace, before/after metrics, verification decision.

## Checkpoints
Baseline before changes; hypothesis before implementation; quality after implementation; independent review before completion.

## Metrics
Search calls/task; stagnant streak; duplicate fingerprints; new tools/search; prompt tokens; elapsed time; completion/quality.

## Retry policy
At most 2 optimization attempts. A retry MUST change a stated hypothesis or parameter based on evidence.

## Stop conditions
Verified improvement; explicit capability-unavailable failure within budget; or second failed optimization attempt.

## Failure path
Restore last known-good configuration, preserve evidence, report unresolved cause, and escalate. Never increase budgets indefinitely to make a test pass.

## Verification
Unit tests plus representative before/after run reviewed independently.

## Definition of Done
Implemented, measured, and independently verified with no blocking quality or security regression.
