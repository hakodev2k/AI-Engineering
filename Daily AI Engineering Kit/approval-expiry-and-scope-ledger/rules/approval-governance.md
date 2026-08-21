# Approval Governance Rules

## MUST
- Bind every approval to `request_id`, `revision`, action type, target, environment, normalized scope, normalized payload fingerprint, policy version, approver identity, issue/incident/change reference when present, and expiry.
- Default to `single-use` approvals.
- Recompute the action fingerprint immediately before execution.
- Fail closed when approval, policy, clock, ledger, or fingerprint state cannot be validated.
- Record each attempted consumption, including blocked and failed executions when an execution token was issued.
- Require a new approval when action, target, environment, scope, payload, risk category, or approval-visible rollback assumptions change.
- Require independent approver roles for production, destructive, security, secret, infrastructure, breaking-contract, irreversible-migration, and large-upgrade actions.
- Use UTC timestamps in machine-readable records.
- Replace secrets with opaque references or cryptographic fingerprints.

## MUST NOT
- Reuse an expired, revoked, superseded, or consumed single-use approval.
- Treat chat text such as "looks good" as approval unless it is captured into the approval record with identity, scope binding, and timestamp.
- Expand wildcard/resource scope after approval.
- Refresh `expires_at` without a new human approval.
- Let the executor be the sole approver when independence is required.
- Store raw tokens, passwords, connection strings, private keys, or other secrets in approval artifacts.
- Interpret successful execution as evidence that approval was valid.

## SHOULD
- Keep approval TTL short enough that underlying state is unlikely to drift.
- Prefer immutable append-only consumption ledgers.
- Link approvals to change/incident/ticket identifiers when available.
- Store only minimum evidence needed to audit the decision.
- Revalidate prerequisite evidence when approval age approaches its TTL limit.