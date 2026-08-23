# Production Debugging and Root Cause Analysis

## Purpose
Diagnose production computer vision failures by separating data, camera, preprocessing, model, post-processing, serving, hardware, and environment causes.

## When to use
Use for quality regressions, latency incidents, unexplained device-specific failures, or inconsistent outputs between environments.

## Inputs
Incident description, affected samples, logs, telemetry, model/runtime versions, deployment history, device metadata.

## Preconditions
Evidence can be collected without violating privacy or production safety constraints.

## Context to inspect
Recent releases, camera settings, image payloads, preprocessing, thresholds, runtime, hardware load, queues, model hashes, downstream logic.

## Core knowledge
The visible model error may be caused upstream or downstream. Senior debugging preserves evidence, reproduces the exact path, and changes one hypothesis at a time.

## Procedure
1. Define impact, scope, and first known bad time.
2. Correlate with model, code, configuration, device, and infrastructure changes.
3. Capture versioned failing inputs and outputs when permitted.
4. Replay the production preprocessing/model/post-processing path.
5. Compare against a known-good version or device.
6. Isolate the failing stage with intermediate artifacts and telemetry.
7. Test the leading hypothesis with the smallest safe experiment.
8. Mitigate through rollback, threshold/config change, or traffic/device isolation when justified.
9. Add a regression test and document root cause.

## Decision points
Rollback vs forward fix; production sampling vs offline replay; model issue vs pipeline issue.

## Common failure patterns
Retraining before proving the cause, losing failing samples, changing several variables, ignoring device/ISP differences, declaring success after mitigation only.

## Verification
Reproduce the failure, demonstrate the causal fix, confirm recovery on affected slices, and verify no material regression elsewhere.

## Expected output
Incident timeline, root cause, mitigation, permanent fix, regression evidence, and residual risk.

## Stop conditions
Escalate when safe evidence collection is impossible, production access is insufficient, or the incident has safety/security implications requiring approval.