# Release and Regression Rules

## Purpose
Prevent performance regressions from reaching users without explicit risk acceptance and rollback readiness.

## Scope
Applies to pull requests, CI gates, staged releases, canaries, feature flags, dependency upgrades, and production rollouts.

## MUST
- Compare material releases against an appropriate baseline using stable performance measurements.
- Block or explicitly disposition regressions that exceed defined budgets or critical user thresholds.
- Preserve a rollback, disablement, or mitigation path for high-risk performance changes.
- Require human approval before production changes that knowingly exceed critical performance budgets.

## MUST NOT
- Waive a regression solely because functional tests pass.
- Hide degraded metrics by changing baselines, test conditions, or reporting windows without review.
- Perform forceful production optimization changes that weaken security, correctness, or contractual behavior without approval.

## SHOULD
- Use staged rollout and release markers to isolate causal changes.
- Automate deterministic bundle and lab gates while using field telemetry for production validation.

## Exceptions
Exceptions require evidence, impact, owner, mitigation, rollback plan, approval, and follow-up criteria.

## Verification
Review CI results, performance diffs, rollout dashboards, RUM release comparisons, feature-flag state, and approval records.