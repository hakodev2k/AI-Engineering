# Workflow: Long-Running Agent Lock/Lease Guard

## Trigger
A workflow will perform repeated or delayed mutations against a resource that may also be targeted by another agent, worker, retry, resume, scheduler or human-driven run.

## Entry conditions
Canonical resource key, scope, risk, shared durable lease store and fencing-capable mutation boundary are defined.

## Flow
```text
Trigger
  ↓
Inspect current resource + lease state
  ↓
Acquire lease + new fencing token
  ↓
Mutation gate
  ↓
Execute bounded work unit
  ↓
Verify checkpoint/result
  ↓
Heartbeat if more work remains
  ↓
Continue or Release

Heartbeat/owner failure
  ↓
Stop mutations
  ↓
Prove expiry
  ↓
Independent review / human approval when required
  ↓
Acquire new lease with greater token
  ↓
Refresh state + replan
  ↓
Resume
```

## Stages
1. **Context** — Lease Coordinator identifies resource scope, current state and concurrency risk.
2. **Acquire** — deterministic store rejects active lease; successful acquire allocates a new fencing token.
3. **Pre-mutation checkpoint** — build intent and run mutation gate.
4. **Execute one bounded unit** — protected write occurs only with current token.
5. **Verification checkpoint** — verify effect using task-specific evidence; do not infer success from lease ownership.
6. **Heartbeat** — renew before interval; one transient retry maximum.
7. **Recovery** — after lost ownership, no writes. Follow `skills/recover-stale-lease.md`.
8. **Release** — explicit normal release when no further protected writes remain.

## Retry rules
- Lease-store transient I/O: max 1 retry.
- Acquisition conflict: 0 retries; observe owner and stop/replan.
- Heartbeat transient error: max 1 retry; then stop mutations.
- Validation/ownership/expiry/security/permission/business-rule failure: 0 retries.
- Takeover: max 1 attempt per observed expired token.

## Approval points
Explicit human approval before forced/production lock break and all dangerous mutations defined in policy. Approval does not extend the lease automatically.

## Failure paths
- Store unavailable → block protected writes.
- Clock not trustworthy → block takeover.
- Current fencing token changed → stale worker must stop.
- Resource state changed after takeover → replan before mutation.
- Reviewer/approver unavailable for required high-risk recovery → block.

## Definition of Done
Current lease lifecycle is valid; every protected mutation was gated by the current fencing token; verification evidence exists; no overlapping owner remains active; recovery, if used, issued a greater token and refreshed state; required approval/review exists; final lease is released or safely expired.
