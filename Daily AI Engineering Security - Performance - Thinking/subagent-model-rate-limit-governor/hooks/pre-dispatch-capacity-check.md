# Hook — Pre-Dispatch Capacity Check

## Trigger
Immediately before dispatching a model-backed child.

## Preconditions
The child has resolved provider, model, quota domain, logical child id, and attempt number.

## Action
1. Derive bucket key `(provider, model, quota-domain)`.
2. Read current in-flight count and bucket limit.
3. If a throttle cooldown is active, queue the child until `not_before`.
4. If in-flight is at limit, queue rather than dispatch.
5. If attempt exceeds configured maximum, fail the logical child with preserved evidence.
6. Emit an admission trace event.

## Script/command
Host integration should apply this contract before network dispatch. For offline trace verification use:

`python scripts/analyze_rate_limits.py trace.jsonl --json`

## Expected result
No bucket exceeds configured in-flight concurrency; retry cooldown and attempt bounds are observable.

## Failure behavior
Fail closed for dispatch when capacity state is unavailable in a workflow known to be under throttle pressure. Do not bypass approval/security policy.

## Blocks completion
Yes, when a production change claims governor enforcement but the host cannot demonstrate pre-dispatch admission events.
