# ML Security Incident Response Rules

## Purpose
Contain, investigate, and recover from security incidents affecting ML systems without destroying critical evidence.

## Scope
Applies to suspected poisoning, model theft, artifact tampering, credential compromise, privacy leakage, and malicious inference activity.

## MUST
- Define incident ownership, escalation paths, containment options, evidence sources, and rollback procedures before production release.
- Preserve relevant model, dataset, pipeline, access, and deployment evidence during investigations.
- Scope affected models and downstream consumers using provenance records.
- Rotate compromised credentials and replace affected artifacts through controlled release paths.
- Document root cause, impact, containment, recovery, and prevention actions after material incidents.

## MUST NOT
- Retrain, delete, or overwrite suspected evidence before preservation requirements are considered.
- Restore service by redeploying an artifact whose integrity remains unverified.
- Close an incident solely because symptoms stopped.

## SHOULD
- Maintain tested rollback and known-good model recovery procedures.
- Run post-incident detection and control improvements against the observed attack path.

## Exceptions
Emergency containment may precede full analysis when necessary to limit harm, but actions and evidence must be recorded.

## Verification
Review incident runbooks, exercises, evidence retention, rollback tests, postmortems, and remediation tracking.