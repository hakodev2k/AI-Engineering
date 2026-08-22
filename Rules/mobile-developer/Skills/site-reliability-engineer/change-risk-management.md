# Change Risk Management

## Purpose
Evaluate production changes by blast radius, reversibility, evidence, and operational readiness so delivery speed does not silently increase reliability risk.

## When to use
Use for high-impact releases, infrastructure changes, dependency upgrades, schema migrations, traffic routing changes, or when change-related incidents recur.

## Inputs
Change description, affected services, deployment plan, rollback plan, test evidence, dependency changes, migration steps, traffic impact, and SLOs.

## Preconditions
The expected behavior and affected production paths must be understood.

## Context to inspect
Recent incidents, release history, feature flags, schema compatibility, capacity, observability, recovery procedures, access controls, and maintenance constraints.

## Core knowledge
Risk increases with uncertainty, blast radius, irreversibility, coupling, and weak detection. Review should be proportional to risk rather than a universal approval ceremony.

## Procedure
1. Identify user journeys and components affected.
2. Classify blast radius and potential failure severity.
3. Determine whether the change is reversible and how quickly.
4. Review mixed-version and dependency compatibility.
5. Validate tests against realistic failure modes.
6. Confirm monitoring can detect regression quickly.
7. Reduce risk with canaries, flags, staged migration, or traffic segmentation.
8. Define explicit abort and rollback criteria.
9. Ensure responders and runbooks are available for high-risk windows.
10. Observe post-change metrics long enough to detect delayed effects.
11. Feed incident evidence back into future risk classification.

## Decision points
Require stronger controls for irreversible, stateful, security-sensitive, or wide-blast-radius changes. Prefer staged change over additional approval when it provides better evidence and reversibility.

## Common failure patterns
Treating all changes equally, approval without technical evidence, migrations that cannot roll back, weak detection, multiple unrelated changes bundled together, and success declared immediately after deployment.

## Verification
Confirm rollout controls executed as designed, abort paths are usable, regression signals are visible, and post-change SLOs remain healthy.

## Expected output
Risk classification, mitigations, rollout/rollback plan, validation evidence, and post-change observation criteria.

## Stop conditions
Escalate when the change is destructive, rollback is unavailable, risk ownership is unclear, or production impact exceeds team authority.