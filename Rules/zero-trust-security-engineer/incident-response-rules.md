# Incident Response Rules

## Purpose
Ensure Zero Trust controls support rapid containment, investigation, and recovery during identity- or access-related incidents.

## Scope
Applies to credential compromise, unauthorized access, policy bypass, device compromise, workload compromise, and lateral movement.

## MUST
- Incident procedures MUST define how to revoke identities, sessions, tokens, certificates, and device trust quickly.
- High-risk containment actions MUST preserve evidence where feasible.
- Responders MUST distinguish suspected compromise from confirmed compromise in operational decisions.
- Post-incident review MUST assess whether trust assumptions or policy gaps enabled the event.

## MUST NOT
- MUST NOT destroy audit evidence unnecessarily during containment.
- MUST NOT restore compromised access paths before root cause is bounded and required controls are restored.
- MUST NOT silently weaken controls to accelerate recovery.

## SHOULD
- Response playbooks SHOULD predefine safe isolation and break-glass paths.
- Major incidents SHOULD feed improvements into policy, telemetry, and detection coverage.

## Exceptions
Emergency deviations require incident commander approval, documented reason, compensating controls, and retrospective review.

## Verification
Run tabletop and technical exercises covering revocation, isolation, credential rotation, evidence preservation, recovery validation, and post-incident control updates.