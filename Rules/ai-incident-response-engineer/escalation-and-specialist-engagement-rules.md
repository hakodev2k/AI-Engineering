# Escalation and Specialist Engagement Rules

## Purpose
Bring the right expertise and authority into AI incidents before risk exceeds responder competence or mandate.

## Scope
Applies to escalation across engineering, security, safety, privacy, legal, compliance, product, infrastructure, data, and provider teams.

## MUST
- Escalation criteria MUST include severity, uncertainty, safety/security/privacy implications, blast radius, irreversibility, and required authority.
- Responders MUST escalate when a decision exceeds their expertise or execution authority.
- Security, privacy, safety, and legal specialists MUST be engaged promptly when incident evidence indicates their domain may be materially affected.
- Escalations MUST include concise facts, current impact, evidence, actions taken, unresolved questions, and requested decision.
- Provider escalation MUST include relevant request IDs, timestamps, region/version data, and reproducible symptoms where available.
- Failure to reach an expected owner during a severe incident MUST trigger the documented backup escalation path.

## MUST NOT
- Responders MUST NOT delay containment of authorized, reversible harm-reduction actions solely while waiting for nonessential stakeholders.
- Specialist advice MUST NOT be represented as formal approval unless the specialist has that authority.
- Escalation channels MUST NOT expose unnecessary sensitive evidence.

## SHOULD
- Maintain current on-call and specialist contact paths.
- Predefine escalation triggers for recurring AI risk classes.

## Exceptions
Low-severity incidents may remain within the primary team if all required expertise and authority are present.

## Verification
Review escalation timestamps, routing, decision records, contact-path tests, and incident outcomes.