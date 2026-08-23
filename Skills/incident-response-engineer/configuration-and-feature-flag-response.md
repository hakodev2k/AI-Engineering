# Configuration and Feature Flag Response

## Purpose
Diagnose and safely mitigate incidents caused by configuration drift, dynamic settings, feature flags, secrets metadata, or policy changes.

## When to use
Use when failures appear without a code deployment, affect selected populations, or correlate with runtime configuration changes.

## Inputs
Configuration history, feature-flag state, rollout rules, environment overrides, policy versions, affected segments, and telemetry.

## Context to inspect
Inspect precedence rules, cached configuration, propagation delay, targeting conditions, defaults, secret references, environment variables, and regional overrides.

## Core knowledge
Configuration is production code with different deployment mechanics. Dynamic controls can enable rapid mitigation but can also create inconsistent states across instances and populations.

## Procedure
1. Capture current effective configuration for affected and healthy instances.
2. Review configuration and flag changes around the incident window.
3. Compare targeting rules across affected populations.
4. Check propagation, caching, and stale-instance behavior.
5. Identify safe previous values or disable paths.
6. Change one setting or flag at a time with explicit scope.
7. Monitor expected technical and customer signals.
8. Confirm all intended instances receive the new state.
9. Record temporary configuration requiring later cleanup.
10. Add validation or rollout controls when configuration caused the incident.

## Decision points
Use feature disablement for fast reversible containment when the feature is noncritical. Revert configuration when previous state is known-good and compatibility remains valid.

## Common failure patterns
Editing the wrong environment, assuming config propagation is immediate, changing multiple flags, undocumented emergency overrides, and restoring defaults without checking why they changed.

## Verification
Verify effective configuration on representative instances and confirm incident symptoms improve without new segment-specific failures.

## Expected output
A configuration assessment and verified mitigation with scope, propagation status, and cleanup actions.

## Stop conditions
Escalate when configuration controls security boundaries, irreversible external behavior, or changes require privileges outside current authorization.