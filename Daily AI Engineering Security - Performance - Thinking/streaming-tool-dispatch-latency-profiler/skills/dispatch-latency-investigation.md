# Skill: Dispatch Latency Investigation

## Purpose
Measure whether streaming tool dispatch waits unnecessarily after a complete, safe-to-run tool call exists.

## Trigger
High p95 agent latency, slow MCP/API tools, streaming migration, or suspected idle time between model and tool spans.

## Inputs
Tool lifecycle JSONL, workload description, ordering constraints, approval/guardrail policy, baseline version.

## Preconditions
Use monotonic timestamps from the same process/clock domain or normalize clock offsets. Identify state-changing tools before experiments.

## Allowed tools
Tracing/logging, benchmark runner, `scripts/dispatch_profiler.py`, test environment.

## Constraints
Do not infer dispatch readiness before approvals/guardrails finish. Do not run destructive tools early merely to improve timing.

## Procedure
1. Capture at least 20 representative calls when possible.
2. Record call completion, safety readiness, tool start/end, response end.
3. Compute dispatch wait = tool start - max(call complete, safety ready).
4. Segment by tool and execution mode.
5. Find p50/p95 waits and critical-path contribution.
6. Form one hypothesis: message-finalization coupling, scheduler queueing, concurrency cap, approval latency, or tool-pool contention.
7. Optimize only the diagnosed layer.
8. Re-run the same workload; compare distributions and correctness.
9. Independently verify ordering/security invariants.

## Decision points
- High wait but safety not ready: optimize approval/guardrail path, not eager dispatch.
- High wait after safety ready: eager dispatch/scheduler path qualifies for experiment.
- Low wait relative to tool/model duration: stop; optimize another bottleneck.

## Expected output
Per-tool distributions, eligible calls, hypothesis, before/after comparison, regressions and verification status.

## Metrics
p50/p95 dispatch wait; tool duration; critical-path latency; eligible-call ratio; error rate; ordering violations.

## Verification
Latency improves on matched workload and no tool result, ordering, approval, guardrail, or security regression occurs.

## Failure handling
Revert experiment on semantic/security regression; retain traces; maximum two optimization attempts before re-diagnosis.

## Stop conditions
Verified improvement, evidence that dispatch is not material, or two failed attempts with escalation.
