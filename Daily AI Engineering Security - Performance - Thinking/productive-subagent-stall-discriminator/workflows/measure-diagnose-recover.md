# Workflow: Measure → Diagnose → Recover

## Trigger
Watchdog kill, repeated timeout, or abnormal token/retry amplification.

## Goal
Recover genuine stalls while avoiding termination of productive slow work.

## Inputs
Trace JSONL, policy, retry history and baseline latency distribution.

## Baseline
Record p50/p95/p99 inter-event gaps, stall rate, token loss, duplicate calls and task success rate.

## Stages
1. **Observe** — collect normalized events.
2. **Measure** — run `scripts/stall_discriminator.py`.
3. **Diagnose** — distinguish provider timeout, human cancel, policy denial, productive wait and confirmed stall.
4. **Form hypothesis** — identify the signal/threshold responsible for the decision.
5. **Improve** — adjust host policy only with baseline evidence.
6. **Measure again** — replay the same representative traces.
7. **Verify** — `subagents/performance-verifier.md` independently checks false-positive and true-stall cases.

## Responsible agent
Runtime investigator implements; Performance Verifier independently verifies.

## Tools
Python 3, event logs and runtime/provider metrics.

## Outputs
Classification evidence, before/after metrics and recovery decision.

## Checkpoints
Before threshold change, before retry and before declaring Verified.

## Metrics
False-positive kill rate, true-stall recovery time, tokens lost to retries, duplicate calls and completion rate.

## Retry policy
Maximum two retries by default. No identical restart without preserved progress or a changed recovery condition.

## Failure path
Missing or contradictory telemetry blocks automatic retry and escalates. Approval/security MUST NOT be bypassed.

## Stop conditions
Retry exhausted, human cancel, policy denial, unsafe replay or verifier rejection.

## Definition of Done
Classifier implemented; baseline/replay metrics collected; tests pass; independent verifier confirms target cases.
