# Skill: Revoke and Verify Permission

## Purpose
End temporary privilege deterministically and prove that the agent no longer relies on it.

## When to use
After the privileged action completes, when the operation is cancelled, when scope changes, or when suspicious/stale use is detected.

## Inputs
Current lease, provider/tool revocation result, and operation evidence.

## Procedure
1. Stop new privileged actions for the lease.
2. Revoke or expire the lease using the authoritative permission system.
3. Update local lease state with `scripts/permission_lease.py revoke` or `expire`.
4. Obtain provider/tool evidence that the lease/token/grant is no longer active when the platform supports introspection.
5. Record `{lease_id, verified, observed_at, source}` without storing secret values.
6. Run `scripts/evaluate-final-gate.py` with revocation evidence.
7. If revocation cannot be verified, mark the workflow blocked and escalate; do not silently assume expiry is enough for high-risk privileges.

## Verification
The lease is non-active and revocation evidence is bound to the same `lease_id`.

## Failure handling
Retry an idempotent revocation check at most twice for transient tool/network failures. Preserve each failure. Permission or policy failures are not retryable.

## Stop conditions
Stop when revocation is verified or when bounded retries are exhausted.
