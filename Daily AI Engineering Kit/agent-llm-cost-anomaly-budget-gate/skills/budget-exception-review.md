# Budget Exception Review Skill

## Purpose
Review requests to temporarily exceed a configured hard LLM budget without silently weakening controls.

## Trigger
Use only when the gate returns `needs-approval` or a planned change is expected to exceed a configured hard limit.

## Inputs
Gate result, usage evidence, requested override amount/duration, business reason, owner, rollback plan, and expiry.

## Preconditions
A human approver must be identifiable. The exception must be time-bounded.

## Procedure
1. Confirm the gate result and exact budget breached.
2. Validate the requested amount, duration, scope, and owner.
3. Verify alternatives were considered: prompt/context reduction, lower-cost model, caching, batching, retry reduction, or traffic shaping.
4. Reject permanent or unbounded exceptions.
5. Require explicit approval before editing production budget configuration.
6. Record approval evidence and expiry.
7. After expiry, restore normal policy and re-run the gate.

## Output
A completed `templates/budget-override-request.md` with status `approved`, `rejected`, or `expired`.

## Verification
Approval identity, timestamp, exact limits, expiry, and rollback criteria must all be present.

## Failure handling
Missing approver, expiry, or evidence blocks the exception.

## Stop conditions
Never continue past an unapproved hard-budget breach.
