# Hook: Pre-agent Start

## Trigger
Immediately before an agent connects to the local model server or receives tool permissions.

## Preconditions
A side-effect-free runtime-state snapshot and approved template fingerprint are available.

## Action
Run:
`python scripts/inference_guard.py --state <runtime-state.json> --policy config/policy.json`

## Expected result
Exit 0 only when listener scope, authentication, effective policy and template integrity satisfy policy.

## Failure behavior
Any non-zero result blocks agent startup. Do not auto-rebaseline template drift.

## Blocking
Yes.
