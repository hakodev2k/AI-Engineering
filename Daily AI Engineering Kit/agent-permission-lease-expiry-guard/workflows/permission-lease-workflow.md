# Workflow: Permission Lease Lifecycle

## Trigger
An agent/tool call requires privilege beyond baseline permissions.

## Entry conditions
Action, actor, operation, capability, resources, and risk category are identifiable.

## Flow
```text
Need elevated capability
  -> minimize capability/resource scope
  -> human approval if dangerous
  -> issue bounded lease
  -> validate lease/action
  -> privileged tool call
  -> consume use budget
  -> verify side effect
  -> revoke/expire
  -> verify revocation
  -> final gate
```

## Stages
1. **Plan** — coordinator creates exact privileged-action contract.
2. **Approval** — mandatory for dangerous/high-risk categories; stop until explicit approval exists.
3. **Issue** — create a lease with <= policy max duration and bounded uses.
4. **Pre-call gate** — run `scripts/evaluate-permission-gate.py`; blocked result stops execution.
5. **Execute** — executor performs only the approved action.
6. **Consume** — run `scripts/consume-permission-lease.py` immediately after the attempted privileged call when the capability was actually exercised.
7. **Verify effect** — collect authoritative operation evidence; execution alone is insufficient.
8. **Close privilege** — revoke/expire; collect revocation evidence.
9. **Independent review** — high-risk renewal/scope-change/revocation ambiguity goes to reviewer.
10. **Final gate** — run `scripts/evaluate-final-gate.py`.

## Retry rules
- Network/tool error during validation/revocation lookup: max 2 retries, preserve evidence.
- Privileged mutation: no blind retry; use operation-specific idempotency/reconciliation first.
- Renewal: maximum 1 by default; must preserve original lease and reason.
- Permission/policy denial: non-retryable without a new explicit authorization path.

## Failure paths
Expired/consumed/revoked lease -> blocked. Scope mismatch -> blocked. Missing high-risk approval/review -> blocked. Revocation unverified -> blocked for high-risk completion.

## Definition of Done
Action was explicitly scoped, lease was valid at call time, side effect was verified, temporary privilege is non-active, required approval/review exists, and final gate reports `verified`.
