# Runbook and Readiness Rules

## Purpose
Ensure teams can respond to AI incidents under time pressure with tested procedures and known authority.

## Scope
Applies to incident runbooks, escalation paths, access readiness, drills, and operational documentation.

## MUST
- Critical AI capabilities MUST have runbooks for likely high-impact failure classes and containment options.
- Runbooks MUST identify owners, escalation paths, required access, evidence sources, containment controls, recovery procedures, and approval boundaries.
- Emergency access mechanisms MUST be auditable, least-privileged, and periodically tested.
- Runbooks MUST be updated after material incidents or platform changes that invalidate procedures.
- Teams MUST periodically exercise high-risk scenarios, including safety, security, provider, and agent/tool failures when applicable.
- Exercises MUST capture gaps and assign remediation owners.

## MUST NOT
- Runbooks MUST NOT contain plaintext production secrets.
- Untested kill switches or recovery procedures MUST NOT be represented as proven capabilities.
- Documentation MUST NOT depend on a single individual's undocumented knowledge for critical response.

## SHOULD
- Keep runbooks concise enough for incident use and link to deeper reference material.
- Include safe commands, expected outputs, and rollback checks where appropriate.

## Exceptions
New capabilities may temporarily operate with provisional runbooks only when risk is accepted and a completion owner is assigned.

## Verification
Review runbook freshness, access tests, exercise reports, corrective actions, and responder feedback.