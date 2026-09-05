# Update and Rollout Rules

## Purpose
Keep model and runtime updates reversible, observable, and safe across distributed edge fleets.

## Scope
Model updates, runtime updates, staged rollout, compatibility checks, and rollback.

## MUST
- Updates MUST be versioned and attributable to a specific artifact and configuration.
- Rollouts MUST be staged when fleet impact is material.
- Compatibility MUST be checked before activation on each supported device class.
- Rollback MUST remain available until the new version is verified stable.

## MUST NOT
- MUST NOT replace all fleet devices simultaneously for a high-risk change when staged rollout is practical.
- MUST NOT delete the last known-good artifact before rollback safety expires.

## SHOULD
- Use cohort-based rollout with measurable stop conditions.

## Exceptions
Immediate rollout requires urgency, risk assessment, rollback readiness, and approval.

## Verification
Inspect rollout configuration, version telemetry, cohort results, rollback tests, and update logs.