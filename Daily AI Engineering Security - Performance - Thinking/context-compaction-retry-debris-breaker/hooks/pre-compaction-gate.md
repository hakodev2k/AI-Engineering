# Hook — Pre-Compaction Gate

## Trigger
Immediately before every automatic or retry compaction request.

## Preconditions
A policy file exists; the candidate manifest contains message kinds, sizes, retry number, previous failed payload size, and whether a previous verified summary is available.

## Action
Run:

`python scripts/compaction_guard.py candidate.json --policy config/policy.json --strict`

## Expected result
Exit `0` and JSON decision `allow` only when the payload is bounded, excluded artifact kinds are absent, retry budget is valid, and a retry is materially smaller or uses a changed strategy.

## Failure behavior
Exit `3` blocks the compaction request and routes to recovery/escalation. Exit `2` means invalid input/config and also blocks.

## Blocking
Yes. This hook MUST block completion rather than allowing an unbounded retry that can amplify durable history.
