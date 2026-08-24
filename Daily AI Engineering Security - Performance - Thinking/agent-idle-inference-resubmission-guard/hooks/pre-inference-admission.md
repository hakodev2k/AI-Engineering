# Hook: Pre-Inference Admission

## Trigger
Immediately before any background/internal worker submits a model request.

## Preconditions
Canonical state contains follow-up, pending-input, state-change, retry-change, and trigger identity information.

## Action
Evaluate the predicate from `rules/inference-admission.md`; emit `allow` with trigger ID or `block_idle` with current state version.

## Script/command
Offline audit: `python scripts/audit_idle_inference.py telemetry.jsonl --max-idle-requests 0`.

## Expected result
No model request occurs when all progress predicates are false.

## Failure behavior
If trigger semantics are missing or malformed, block the autonomous background request and emit diagnostic evidence; do not silently consume or discard pending user work.

## Blocking
Yes for background/internal inference. Foreground user requests with verified fresh input are not blocked by an internal-worker telemetry failure.