# Skill: Request and Bind Permission Lease

## Purpose
Obtain the minimum temporary capability required for one operation without turning a transient need into standing privilege.

## When to use
Before any tool/API action that needs permissions beyond the agent's baseline capability set.

## Inputs
- actor ID and operation ID
- exact capability names
- exact resource scope
- risk category
- expected duration and number of uses
- approval evidence when policy requires it

## Preconditions
The intended action is known, resources are identified, and a less-privileged path has been considered.

## Allowed tools
Read-only repository/context tools, policy validators, and the lease issuer. Do not perform the privileged action yet.

## Procedure
1. Describe the intended side effect and affected resources.
2. Reduce capability set to the smallest verbs/actions required.
3. Reduce resource scope to explicit targets; avoid wildcards unless policy explicitly permits them.
4. Bind the request to one stable `operation_id`.
5. Classify risk. High-risk actions require explicit human approval and independent review.
6. Choose the shortest practical lease duration and bounded `max_uses`.
7. Issue the lease with `scripts/permission_lease.py issue`.
8. Validate the action against the lease with `scripts/evaluate-permission-gate.py` before execution.
9. Stop if any actor, operation, capability, resource, expiry, or use-budget mismatch exists.

## Expected output
A machine-readable permission lease and an allow/blocked gate decision.

## Verification
Lease scope must exactly cover the action and no broader capability/resource than required.

## Failure handling
Permission failure never authorizes scope expansion. Re-plan or request a new lease. Maximum one renewal per policy unless a human explicitly authorizes a new operation.

## Stop conditions
Stop on missing approval, unknown scope, expired lease, exhausted use budget, or policy mismatch.
