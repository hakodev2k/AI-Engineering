# Rollout and Rollback

## Purpose
Limit blast radius and provide controlled recovery when configuration changes behave unexpectedly.

## Scope
Configuration deployment, activation, propagation, staged rollout, and rollback.

## MUST
- Production-impacting changes MUST define success signals and failure signals before rollout.
- High-blast-radius changes MUST use staged or otherwise bounded rollout when the platform permits it.
- A rollback or forward-fix strategy MUST exist before activating a risky change.
- Rollback feasibility MUST account for irreversible side effects caused by the new configuration.
- Rollout status MUST be observable across the affected fleet or consumer population.

## MUST NOT
- A successful write or deployment command MUST NOT be treated as proof of successful behavior.
- Rollout MUST NOT continue after predefined stop conditions are met without explicit human authorization.
- Rollback MUST NOT restore configuration that is incompatible with already-migrated state.

## SHOULD
- Prefer progressive exposure and automated health gates.
- Practice rollback for critical configuration paths.

## Exceptions
Immediate global changes may be required for urgent security containment; they require explicit approval, heightened monitoring, and a documented recovery plan.

## Verification
Inspect rollout plans, health gates, telemetry, propagation status, rollback tests, and post-change evidence. In safe environments, simulate failure and verify rollout stops and recovery restores expected behavior.