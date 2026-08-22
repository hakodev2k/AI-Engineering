# Production Debugging

## Purpose
Diagnose Vue production defects systematically using reproducible evidence while minimizing user impact and speculative changes.

## When to use
Use for production-only UI defects, crashes, stale state, routing failures, performance incidents, and integration regressions.

## Inputs
Incident report, browser/version, logs, telemetry, source maps, network evidence, release history, and reproduction details.

## Context to inspect
Inspect recent deployments, console errors, failed requests, feature flags, route/state transitions, browser compatibility, and monitoring.

## Core knowledge
Production failures often involve environment, timing, data shape, caching, or deployment differences. Correlation is not causation. Preserve evidence before changing behavior.

## Procedure
1. Define impact, affected population, and timeline.
2. Correlate onset with releases/config changes.
3. Gather console, network, telemetry, and user-state evidence safely.
4. Reproduce under closest possible conditions.
5. Form ranked hypotheses tied to evidence.
6. Test one hypothesis at a time.
7. Mitigate first when impact is severe.
8. Implement the smallest durable fix.
9. Add regression coverage and observability.
10. Verify after deployment using production signals.

## Decision points
Rollback/disable when impact is high and cause uncertain; hotfix when cause and blast radius are understood; investigate longer when safe mitigation exists.

## Common failure patterns
Guessing from stack traces alone, changing multiple variables, debugging minified code without source mapping, exposing user data in logs, and declaring success from local tests only.

## Verification
Confirm the original production symptom disappears, telemetry normalizes, and regression tests cover the root cause.

## Expected output
Evidence-backed root cause, mitigation/fix, verification, and prevention action.

## Stop conditions
Escalate when production access, security-sensitive evidence, or cross-team dependency ownership blocks safe diagnosis.