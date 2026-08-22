# Hook: Pre-Side-Effect Policy Check

## Trigger
Immediately before a tool adapter or delegated agent performs a medium/high-impact side effect.

## Preconditions
Request has normalized capability, target, actor/session, arguments, delegation provenance, and approval evidence.

## Action
Serialize the request and run:

`python scripts/policy_gate.py request.json --policy config/policy.json --strict`

## Expected result
Exit code 0 for allow. Exit code 4 means approval is required and blocks execution until fresh bound approval is supplied. Exit code 5 is deny and blocks execution.

## Failure behavior
Invalid/missing metadata fails closed. Preserve decision evidence in audit logs. Do not execute the side effect on script or policy errors.

## Blocking
Yes.
