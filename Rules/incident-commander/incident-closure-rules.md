# Incident Closure Rules

## Purpose
Ensure incident command ends only after active risk is controlled and residual work has explicit ownership.

## Scope
Applies to transition from active response to monitoring, remediation, reconciliation, or post-incident work.

## MUST
- Close active command only after recovery criteria are met and the stability window is acceptable for the incident risk.
- Record final customer impact, duration, affected systems, mitigations, unresolved risks, and follow-up owners.
- Transfer remaining remediation, data reconciliation, security, or monitoring work to named owners with deadlines or tracking references.
- Communicate closure or monitoring state to the same stakeholder groups that received active-incident updates when appropriate.
- Preserve the incident timeline and evidence for review.

## MUST NOT
- Close an incident merely because responder activity has slowed.
- Leave known high-risk follow-up work without accountable ownership.
- Remove temporary mitigations before their replacement or rollback plan is ready.

## SHOULD
- Distinguish resolved, monitoring, and follow-up states clearly.
- Schedule post-incident review according to severity and learning value.

## Exceptions
Low-severity incidents may use lightweight closure records, but impact, recovery evidence, and residual ownership must remain explicit.

## Verification
Inspect closure notes, recovery evidence, follow-up trackers, owner assignments, stakeholder updates, and preserved incident artifacts.