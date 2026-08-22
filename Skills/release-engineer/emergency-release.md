# Emergency Release

## Purpose
Deliver urgent production fixes quickly while preserving minimum safety, traceability, and recovery controls.

## When to use
Use for active severe incidents, critical security remediation, or urgent defects where normal lead time creates greater risk than expedited delivery.

## Inputs
Incident context, proposed fix, affected versions, test evidence, production topology, recovery plan, decision authority, and communication channels.

## Preconditions
An authorized incident/change owner agrees that expedited release is justified.

## Context to inspect
Inspect current production version, ongoing incident actions, pending deployments, fix diff, security implications, migration requirements, and available telemetry.

## Core knowledge
Emergency does not mean uncontrolled. Preserve artifact provenance, focused validation, least privilege, explicit decision ownership, and post-deploy verification. Defer nonessential ceremony, not controls needed to prevent making the incident worse.

## Procedure
1. Confirm emergency criteria and accountable decision owner.
2. Freeze unrelated production changes where appropriate.
3. Minimize fix scope.
4. Build through the trusted pipeline whenever possible.
5. Run focused tests covering defect and critical regression paths.
6. Confirm artifact identity and recovery path.
7. Deploy using the safest fast rollout available.
8. Monitor incident and release-specific signals continuously.
9. Roll back/forward immediately if impact worsens.
10. Complete deferred records, tests, and retrospective actions after stabilization.

## Decision points
Prefer configuration/feature disable when it mitigates faster and more safely than code. Bypass a normal gate only with explicit rationale and compensating verification.

## Common failure patterns
Direct production edits, untracked binaries, stacking multiple speculative fixes, bypassing all tests, simultaneous unrelated deploys, and forgetting to reconcile emergency state back into source/configuration.

## Verification
Confirm the incident symptom is resolved, no critical regression appears, production matches source-controlled state, and deferred controls are completed.

## Expected output
A traceable emergency release with minimal scope, verified recovery, and follow-up actions.

## Stop conditions
Stop if the proposed fix cannot be understood well enough to bound risk, recovery is impossible for a potentially destructive change, or required production authority is absent.