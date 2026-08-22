# Release Safety Rules
## Purpose
Reduce customer impact from frontend deployments and make failures reversible.
## Scope
Deployments, static assets, CDN behavior, feature flags, rollback, and release verification.
## MUST
- Release plans for high-impact changes MUST define verification, rollback or disable path, and responsible owner.
- Frontend/backend rollout order MUST preserve compatibility during independent deployment windows.
- Static asset caching MUST support safe transition between application versions.
- Feature flags affecting critical behavior MUST have owner, default state, and cleanup criteria.
- Production deployment or high-risk configuration changes MUST require human approval when governance requires it.
## MUST NOT
- Breaking public behavior or irreversible user-impacting changes MUST NOT be deployed without explicit approval.
- Rollback MUST NOT be assumed safe when data or backend contracts have changed; compatibility must be checked.
## SHOULD
- Use staged rollout or progressive exposure for changes with uncertain impact.
## Exceptions
Emergency remediation may use expedited approval with retained evidence.
## Verification
Release checklist, compatibility tests, CDN/cache inspection, smoke tests, metrics, and rollback exercise where warranted.