# State Management

## Purpose
Protect Terraform state as authoritative infrastructure metadata.

## Scope
All local and remote state, state backends, locking, import, move, and recovery operations.

## MUST
- Production state MUST use a durable remote backend with encryption, access control, versioning or equivalent recovery capability, and locking where supported.
- State boundaries MUST align with ownership and blast-radius boundaries.
- State-moving, importing, or removing operations MUST have a reviewed plan and backup or recovery path.
- Sensitive state access MUST be restricted and audited.

## MUST NOT
- State files MUST NOT be committed to source control.
- Production state MUST NOT be edited manually.
- Locking MUST NOT be bypassed merely to unblock a run.
- Unverified state replacement or deletion MUST NOT be executed without human approval.

## SHOULD
- State SHOULD remain small enough for predictable planning and recovery.
- Backend configuration SHOULD be standardized across environments while preserving isolation.

## Exceptions
Any exception requires documented reason, risk, recovery procedure, evidence, and approval for production-impacting changes.

## Verification
Inspect backend configuration, IAM, encryption, locking, version history, repository ignores, audit logs, and plan output. Test recovery procedures periodically.