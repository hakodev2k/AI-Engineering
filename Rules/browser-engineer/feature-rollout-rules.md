# Feature Rollout Rules
## Purpose
Ship browser features reversibly while controlling compatibility, security, and stability risk.
## Scope
Runtime flags, staged rollout, experiments, deprecation, and emergency disablement.
## MUST
- High-risk web-platform changes MUST have a defined rollback or kill mechanism before broad rollout where technically feasible.
- Rollout criteria MUST include correctness, crash, performance, compatibility, privacy, and security signals relevant to the feature.
- Default-state changes MUST be reviewed as public behavior changes.
## MUST NOT
- MUST NOT use a feature flag as a substitute for fixing known critical safety defects.
- MUST NOT remove rollback capability before stability evidence supports doing so.
## SHOULD
- SHOULD stage exposure progressively when real-world compatibility uncertainty is material.
## Exceptions
Irreversible enablement requires documented necessity and senior approval.
## Verification
Inspect flag configuration, rollout dashboards, test both states, validate rollback, and review post-launch signals.