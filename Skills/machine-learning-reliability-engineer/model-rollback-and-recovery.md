# Model Rollback and Recovery

## Purpose
Restore an ML system to a known-good state quickly and safely when a model, feature, configuration, or serving change causes unacceptable behavior.

## When to use
Use before production launch to establish rollback readiness, during release planning, or during incidents requiring rapid recovery.

## Inputs
- Current and prior model artifacts
- Feature and preprocessing versions
- Deployment manifests
- Compatibility matrix
- State and cache behavior
- Recovery objectives

## Context to inspect
Inspect artifact immutability, model/feature compatibility, schema evolution, routing, caches, online stores, downstream side effects, and whether old versions remain deployable.

## Core knowledge
Model rollback is often more than replacing weights. A reliable rollback may require reverting preprocessing, feature definitions, thresholds, runtime images, configuration, and routing. Recovery must preserve compatibility with current data and avoid replaying irreversible actions.

## Procedure
1. Define the complete deployment unit that must move together.
2. Identify the last known-good artifact and supporting dependencies.
3. Maintain compatibility information across model, features, preprocessing, and runtime.
4. Automate rollback with explicit target versions rather than mutable tags.
5. Define rollback triggers and authority.
6. Test rollback in a production-like environment.
7. Verify caches and state are safe across version changes.
8. During rollback, preserve incident evidence before destructive cleanup.
9. Validate service and model-quality indicators after restoration.
10. Define forward-recovery criteria before redeploying a corrected candidate.

## Decision points
Rollback when impact is high and a known-good state is available. Prefer forward fixes only when rollback is incompatible, riskier, or cannot restore the affected dependency. Use traffic routing to isolate versions when full rollback is unnecessary.

## Common failure patterns
- Old model depends on removed features.
- Mutable artifact tags point to the wrong binary.
- Only model weights are reverted while thresholds remain changed.
- Cache entries encode incompatible outputs.
- Rollback is documented but never rehearsed.

## Verification
Execute a rollback drill and verify target artifact hashes, dependency compatibility, recovery time, telemetry, and restored quality against known-good baselines.

## Expected output
A tested rollback runbook, compatibility matrix, recovery criteria, and evidence that prior versions can be restored within objectives.

## Stop conditions
Stop rollback if the target artifact cannot be authenticated, compatibility is unknown, or reverting would trigger destructive downstream behavior requiring approval.