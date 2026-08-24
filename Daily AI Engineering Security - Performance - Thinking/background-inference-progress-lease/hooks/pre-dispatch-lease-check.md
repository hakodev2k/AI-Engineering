# Hook — Pre-Dispatch Lease Check

## Trigger
Immediately before any background/deferred worker dispatches a model request.

## Preconditions
Authoritative owner state and durable logical-job counters are readable; the worker declares its purpose and observable progress version.

## Action
Append the prospective request record to a policy-evaluation stream or evaluate the same fields in-process, then enforce the equivalent of:

`python scripts/progress_lease_analyzer.py <worker-trace.jsonl> --max-requests 50 --max-input-tokens 2000000 --max-no-progress 3 --max-duplicate-fingerprint 3`

Production integrations SHOULD evaluate incrementally rather than rescan a file, but MUST preserve identical invariants.

## Expected result
Exit/decision 0 permits dispatch. Exit/decision 2 blocks dispatch and records the violated invariant. Input/telemetry error blocks unattended dispatch.

## Failure behavior
Fail closed for terminal-owner, unknown-counter, and hard-budget cases. For an unavailable optional metrics sink, persist locally and continue only if authoritative counters remain available.

## Blocks completion
Yes when the worker is terminal-owner, over budget, or beyond no-progress/duplicate bounds. Completion may proceed without the worker if its output is optional and the parent task's definition of done is independently satisfied.
