# Incident Closure Rules

## Purpose
Close incidents only when active risk is controlled and remaining work is explicitly owned.

## Scope
Resolution declaration, transition to follow-up, documentation, and closure governance.

## MUST
- Confirm recovery criteria, customer impact cessation, critical data integrity, dependency health, and stability as applicable.
- Identify unresolved risks, temporary mitigations, repairs, customer follow-up, and corrective actions with owners.
- Preserve the incident record and evidence required for review.
- Communicate resolution consistently to affected internal and external audiences according to policy.

## MUST NOT
- Close an incident to improve metrics while material impact or unowned recovery work remains.
- Delete or rewrite evidence needed for post-incident analysis.

## SHOULD
- Distinguish service restored, incident mitigated, incident resolved, and follow-up complete where those states differ.

## Exceptions
Long-running repair may continue after active incident closure when immediate impact is controlled and repair has explicit governance, monitoring, and escalation criteria.

## Verification
Review closure criteria, telemetry, reconciliation, temporary mitigations, ownership records, and final communications.