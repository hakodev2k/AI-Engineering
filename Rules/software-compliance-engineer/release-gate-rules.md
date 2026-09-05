# Release Gate Rules

## Purpose
Prevent software from reaching production when mandatory compliance conditions are unresolved.

## Scope
Applies to releases, deployments, major configuration changes, and compliance-sensitive feature activation.

## MUST
- Release criteria MUST identify which compliance checks are mandatory for the change risk level.
- Required failed or missing checks MUST block release unless an authorized exception exists.
- The gate MUST evaluate the exact artifact and configuration intended for production where practical.
- High-risk releases MUST include evidence of rollback or controlled recovery.

## MUST NOT
- MUST NOT convert mandatory compliance gates into advisory warnings without approved policy change.
- MUST NOT treat a prior release's evidence as sufficient after material changes.

## SHOULD
- Automate deterministic gates in CI/CD and surface the evidence used for the decision.

## Exceptions
Emergency release exceptions require explicit authority, bounded scope, compensating controls, and post-release verification.

## Verification
Inspect pipeline configuration, gate results, artifact identity, exception records, and release approvals.