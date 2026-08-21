# Production Debugging

## Purpose
Investigate React production defects systematically using evidence and controlled hypotheses.

## When to use
Use for client errors, blank screens, state corruption, browser-specific bugs, and production-only regressions.

## Inputs
Incident report, logs, traces, release info, browser/device details, reproduction steps.

## Preconditions
Preserve evidence and avoid speculative production changes.

## Context to inspect
Error telemetry, network traces, source maps, feature flags, recent deploys, browser console, persisted client state.

## Core knowledge
Production defects can originate in frontend code, API behavior, CDN/cache, browser differences, stale assets, or environment configuration.

## Procedure
1. Define user impact and timeline.
2. Correlate onset with releases/config changes.
3. Reproduce with matching browser/account/data where safe.
4. Inspect errors, network, storage, and loaded asset versions.
5. Form one hypothesis at a time.
6. Validate using logs/traces or controlled experiments.
7. Mitigate with rollback/flag when impact warrants it.
8. Fix root cause and add regression protection.
9. Document evidence and prevention action.

## Decision points
Mitigate first when user impact is high; investigate longer only when rollback/disablement is riskier.

## Common failure patterns
Clearing caches without learning, guessing from one screenshot, changing multiple variables, blaming frontend before inspecting API/network.

## Verification
Reproduce before fix when possible, confirm fix on affected conditions, and monitor post-release telemetry.

## Expected output
Evidence-backed root cause and verified remediation.

## Stop conditions
Stop and escalate on security incidents, data loss, or unavailable production evidence requiring privileged access.