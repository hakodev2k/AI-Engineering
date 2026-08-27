# Identity Lifecycle
## Purpose
Control identity creation, change, suspension, and termination.
## Scope
Human and non-human identity lifecycle events.
## MUST
- Every identity MUST have an authoritative owner or source and a defined lifecycle state.
- Termination or compromise events MUST revoke effective access within the documented risk-based SLA.
- Rehire, transfer, and role-change flows MUST re-evaluate inherited access.
## MUST NOT
- Orphan identities MUST NOT retain privileged access.
- Disabled identities MUST NOT remain usable through alternate credentials.
## SHOULD
- Automate lifecycle transitions from authoritative events with reconciliation.
## Exceptions
Require explicit owner, expiry, rationale, and monitoring.
## Verification
Reconcile source records to directories, sample lifecycle events, and test revocation paths.