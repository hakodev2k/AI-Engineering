# Hook: Pre-Remediation Scope Gate

## Trigger
Immediately before a reviewer finding is converted into implementation work or a new failing test.

## Preconditions
Frozen acceptance contract and machine-readable finding are available.

## Action
Run:
`python scripts/review_scope_gate.py --contract <contract.json> --finding <finding.json>`

## Expected result
- Exit `0`: accepted in-scope blocker; remediation may proceed.
- Exit `3`: finding deferred; active plan must remain unchanged.
- Exit `2`: malformed evidence; return to reviewer for correction.

## Failure behavior
Fail closed for plan mutation. Preserve the finding and gate output for audit.

## Blocks completion
A valid accepted blocker blocks completion until verified fixed. A deferred finding does not block the current acceptance contract.
