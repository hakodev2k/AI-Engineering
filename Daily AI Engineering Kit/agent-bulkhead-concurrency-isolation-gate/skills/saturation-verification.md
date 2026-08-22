# Saturation Verification Skill

## Purpose
Prove that overload in one bulkhead partition does not starve unrelated workloads.

## Inputs
Implemented bulkhead, policy, non-production test target, baseline latency/error data, acceptance thresholds.

## Preconditions
- No production load generation.
- Test workloads can be separated by partition.
- Metrics or timing evidence can be captured.

## Procedure
1. Record an unloaded baseline for all partitions.
2. Saturate exactly one target partition above its configured concurrency and queue capacity.
3. Confirm excess work is rejected or times out within the configured queue timeout.
4. While saturation continues, execute control requests against at least one unrelated partition.
5. Confirm the control partition continues to acquire capacity and remains within the agreed test latency/error budget.
6. Confirm active permits never exceed configured `max_concurrency`.
7. Confirm queued work never exceeds `max_queue`.
8. Confirm retry attempts do not exceed `retry_limit` and do not cross the caller deadline.
9. Stop load; confirm the saturated partition recovers without manual pool reset.
10. Preserve test command, timestamps, relevant metrics, failures, and final verdict.

## Verification result
Return `verified` only when isolation, bounds, rejection behavior, and recovery are demonstrated by test evidence. Otherwise return `failed` or `blocked` with the exact missing evidence.

## Failure handling
Retry transient harness failures at most twice. Do not raise production limits or disable safety mechanisms to make the test pass.

## Stop conditions
Stop immediately if the target is production, if the test may cause destructive side effects, or if authorization for load generation is absent.
