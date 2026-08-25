# Self-Service Guardrail Rules
## Purpose
Enable developer autonomy without silently expanding operational authority.
## Scope
Provisioning, environment actions, repository automation, access requests, and platform mutations.
## MUST
- Self-service actions MUST authenticate, authorize, validate target scope, and produce an audit trail.
- Risky actions MUST distinguish analyze, recommend, prepare, and execute permissions.
- Destructive infrastructure, production configuration, secret rotation, high-risk access, and irreversible changes MUST require human approval appropriate to policy.
- Actions MUST expose dry-run or preview when meaningful and technically feasible.
## MUST NOT
- MUST NOT infer authorization from repository write access or UI visibility alone.
- MUST NOT silently broaden permissions to make automation succeed.
## SHOULD
- Guardrails SHOULD prevent invalid states before execution rather than rely only on after-the-fact detection.
## Exceptions
Emergency elevation requires explicit authorization, bounded duration, auditability, and revocation.
## Verification
Test authorization matrices, approval gates, previews, audit records, and denied-action behavior.