# Feature Flag and Progressive Delivery Rules

## Purpose
Use staged exposure and controlled activation to reduce blast radius without confusing deployment completion with feature-release completion.

## Scope
Applies to feature flags, canaries, cohorts, traffic splitting, staged regional rollout, and progressive activation.

## MUST
- Progressive rollout plans MUST define cohort or traffic stages, observation windows, health criteria, stop conditions, and accountable decision owners.
- Feature activation state MUST be tracked separately from artifact deployment state.
- Flag dependencies, default states, failure behavior, and rollback/disable mechanisms MUST be understood before production use.
- Expansion to the next stage MUST use evidence from the current stage and relevant business and technical signals.
- Long-lived release flags MUST have ownership and removal or consolidation criteria.

## MUST NOT
- Traffic MUST NOT be increased automatically past a failed safety threshold unless a separately approved control policy explicitly permits it.
- A feature flag MUST NOT be treated as a complete rollback mechanism when schema, data, infrastructure, or external side effects remain.
- Sensitive or authorization behavior MUST NOT rely on insecure client-controlled flags.

## SHOULD
- Initial exposure SHOULD use the smallest representative cohort that can produce meaningful evidence.
- Flag cleanup SHOULD be included in follow-up work to avoid permanent configuration complexity.

## Exceptions
Immediate broad activation requires documented need, evidence, risk, recovery path, and approval appropriate to customer and operational impact.

## Verification
Inspect rollout configuration, cohort definitions, flag state, telemetry, threshold decisions, expansion timestamps, ownership, and cleanup records.