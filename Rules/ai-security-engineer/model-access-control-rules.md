# Model Access Control Rules

## Purpose
Protect model endpoints, administrative controls, and sensitive capabilities from unauthorized use.

## Scope
Applies to hosted models, inference APIs, model consoles, fine-tuning endpoints, evaluation endpoints, and administrative operations.

## MUST
- Model access MUST require authenticated identities appropriate to the deployment risk.
- Authorization MUST be enforced server-side for every protected capability and tenant boundary.
- Administrative model operations MUST use stronger privileges than ordinary inference.
- Service identities MUST be distinct from human identities and limited to required capabilities.
- Privileged access MUST be reviewed periodically and revoked when no longer required.

## MUST NOT
- MUST NOT rely on client-side checks for authorization.
- MUST NOT share long-lived privileged credentials across unrelated services or teams.
- MUST NOT expose unrestricted model administration to public networks without approved controls.

## SHOULD
- Prefer short-lived credentials, workload identity, and centralized policy enforcement.
- Monitor unusual access patterns and privilege escalation attempts.

## Exceptions
Exceptions require documented scope, duration, compensating controls, and approval from the accountable security owner.

## Verification
Review IAM policies, endpoint authorization tests, access logs, credential lifetime, network exposure, and periodic access-review evidence.