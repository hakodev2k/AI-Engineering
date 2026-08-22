# Hook — Pre-Invoke Lifecycle Check

## Trigger
Immediately before any tool invocation with side effects, especially after approval/session resume.

## Preconditions
The runtime has a lifecycle JSON record and `config/policy.json`.

## Action
Run:
`python3 scripts/lifecycle_guard.py record.json --policy config/policy.json --phase preinvoke`

## Expected result
- Exit 0: invocation may proceed.
- Exit 4: current call requires approval/reapproval.
- Exit 5: deny/integrity error; do not execute.
- Exit 2: invalid input/config; fail closed for high-impact calls.

## Failure behavior
Do not execute or automatically retry the side effect. Preserve the call ID, argument hash, and violation codes for reconciliation.

## Blocks completion
Yes for high-impact paths or any duplicate/stale-approval/lifecycle-integrity violation.
