# IoT Production Debugging

## Purpose
Diagnose field failures across firmware, hardware, network, cloud, environment, and version interactions using evidence.

## When to use
Use for crashes, resets, missing telemetry, battery drain, command failures, or site-specific incidents.

## Inputs
Incident timeline, device identity, versions, logs, metrics, crash dumps, network and environmental data.

## Context to inspect
Recent releases, cohort health, reset reasons, resource usage, connectivity, backend status, hardware revision, and configuration.

## Core knowledge
IoT failures often cross layers and may be unreproducible in labs. Preserve evidence before resets/updates and compare affected devices with healthy cohorts.

## Procedure
1. Define observed versus expected behavior and time window.
2. Preserve volatile evidence.
3. Identify affected cohort and common dimensions.
4. Correlate device, network, gateway, and cloud timelines.
5. Form falsifiable hypotheses.
6. Reproduce with matching hardware/version/environment where possible.
7. Add targeted temporary diagnostics if safe.
8. Fix the narrowest proven cause.
9. Verify with regression and fleet health monitoring.

## Decision points
Prefer remote diagnostics when risk is low; retrieve physical units when hardware/environment evidence is required.

## Common failure patterns
Factory-resetting before evidence capture, changing multiple variables, blaming connectivity without traces, and shipping speculative fixes.

## Verification
Demonstrate reproduction before fix when possible, non-reproduction after fix, and cohort recovery in production.

## Expected output
A supported root cause, corrective action, and regression protection.

## Stop conditions
Escalate when investigation requires unsafe physical testing or unauthorized production access.