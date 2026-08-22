# Release lifecycle hooks
## Intake
Reject missing version, owner, target environment, risk, artifact, or rollback description.
## Pre-readiness
Confirm evidence set, dependency graph, provenance, environment health, and open incidents.
## Pre-production
Require production approval, immutable artifact identity, rollback readiness, and no unaccepted critical blocker.
## Pre-promotion
Record current deployed version and checkpoint state.
## Post-promotion
Run smoke, health, dependency, and business-critical verification.
## Closeout
Persist final status, timestamps, approvals, deviations, monitoring outcome, and handoff.
Hooks should be deterministic and idempotent where possible. A failed hook blocks progression until corrected or explicitly approved as an exception.