# Hook: Pre-Remediation Scope Gate

## Trigger
Immediately before a reviewer finding becomes implementation work or a new failing test.

## Preconditions
Frozen acceptance contract and machine-readable finding exist.

## Action
Run `python scripts/review_scope_gate.py --contract <contract.json> --finding <finding.json>`.

## Expected result
- Exit `0`: accepted in-scope blocker; remediation may proceed.
- Exit `3`: deferred; active plan stays unchanged.
- Exit `2`: malformed evidence; return to reviewer.

## Failure behavior
Fail closed for plan mutation and preserve the decision record.

## Blocking
Yes for valid accepted blockers. Deferred findings do not block the current acceptance contract.
