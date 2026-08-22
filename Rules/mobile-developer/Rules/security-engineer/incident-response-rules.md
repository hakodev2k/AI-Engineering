# Security Incident Response Rules

## Purpose
Ensure suspected security incidents are contained, investigated, recovered, and learned from safely.

## Scope
Applies to suspected compromise, data exposure, credential misuse, malicious activity, and material security-control failure.

## MUST
- Incidents MUST have a clear severity, incident owner, communication path, and decision authority.
- Containment actions MUST balance stopping harm with preserving evidence and service safety.
- Investigation conclusions MUST be supported by logs, telemetry, forensic evidence, or other verifiable data.
- Credentials, keys, or sessions known to be compromised MUST be revoked, rotated, or invalidated according to risk.
- Recovery MUST include verification that the attack path or control failure has been addressed.
- Material incidents MUST produce documented lessons and follow-up actions.

## MUST NOT
- MUST NOT destroy relevant evidence unless immediate safety requires it.
- MUST NOT declare an incident resolved solely because visible symptoms stopped.
- MUST NOT conceal material incident facts from required decision makers.

## SHOULD
- Maintain tested playbooks for common incident classes.
- Prefer reversible containment actions when effectiveness is comparable.

## Exceptions
Emergency deviations require documented reason and post-incident review.

## Verification
Use incident timelines, evidence records, response logs, recovery validation, post-incident reviews, and remediation tracking.