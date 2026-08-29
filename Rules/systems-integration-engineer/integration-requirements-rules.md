# Integration Requirements Rules

## Purpose
Ensure integrations are built from explicit business, technical, operational, and compliance requirements.

## Scope
Applies to new integrations and material changes to existing integrations.

## MUST
- Integration requirements MUST identify source, destination, ownership, data exchanged, triggering conditions, success criteria, failure behavior, latency expectations, volume assumptions, and recovery expectations.
- Non-functional requirements MUST include availability, throughput, security, privacy, observability, and support ownership where relevant.
- Ambiguous field meanings, timing semantics, and system-of-record responsibilities MUST be resolved before implementation.
- Critical assumptions MUST be documented and validated with the relevant system owners.

## MUST NOT
- MUST NOT infer contractual behavior from undocumented examples alone.
- MUST NOT treat stakeholder agreement on a happy-path demo as sufficient production readiness.

## SHOULD
- Requirements SHOULD distinguish mandatory behavior from implementation preferences.
- High-risk integrations SHOULD define explicit rollback and degraded-mode expectations before build starts.

## Exceptions
Exceptions MUST state the unresolved requirement, business reason for proceeding, risk, temporary mitigation, owner, and review date.

## Verification
Review requirements, interface specifications, architecture decisions, acceptance criteria, and stakeholder approvals. Confirm every critical flow and failure mode has an accountable owner.