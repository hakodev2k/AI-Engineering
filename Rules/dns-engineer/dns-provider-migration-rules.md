# DNS Provider Migration Rules

## Purpose
Move DNS providers without breaking delegation, DNSSEC, or client resolution.

## Scope
Authoritative provider migrations, secondary-provider changes, and registrar coordination.

## MUST
- New providers MUST serve complete validated zone data before delegation shifts.
- Migration plans MUST address NS, glue, TTLs, DNSSEC keys/DS, API integrations, monitoring, and rollback.
- Old authoritative service MUST remain available until prior delegation and record caches can safely expire unless risk dictates otherwise.

## MUST NOT
- MUST NOT switch delegation before validating every critical record and required DNSSEC state.
- MUST NOT decommission the old provider based solely on control-plane confirmation.

## SHOULD
- Migrations SHOULD use staged overlap and external validation from multiple resolvers and regions.

## Exceptions
Accelerated migrations require documented outage/security rationale and explicit approval.

## Verification
Compare zones, trace delegation, validate DNSSEC, test critical records externally, and confirm cache convergence before decommission.