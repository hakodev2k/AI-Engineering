# Guardrail Code Review

## Purpose
Review guardrail code for correctness, bypass resistance, maintainability, observability, safe failure.

## When to use
Use for policy engines, validators, classifiers, authorization, redaction, context, configuration changes.

## Inputs
Diff, requirements, threat model, tests, architecture, config, deployment behavior.

## Context to inspect
Inspect callers, errors, concurrency, caches, flags, credentials, logs.

## Core knowledge
Review malformed data, timeout, dependency failure, stale config, races, partial execution, bypasses—not just happy paths.

## Procedure
1. Identify invariant.
2. Trace protected action routes.
3. Verify server-side authorization.
4. Review validation.
5. Check failure semantics.
6. Check tenant state/cache.
7. Review sensitive logging.
8. Confirm versions.
9. Require adversarial tests.
10. Assess rollout/rollback.

## Decision points
Request architecture change when local patches cannot establish invariants.

## Common failure patterns
Fail-open, validation after effects, model authorization, swallowed errors, global policy, unrealistic mocks.

## Verification
Exercise denied/malformed/degraded/cross-tenant/concurrent paths.

## Expected output
Prioritized review findings.

## Stop conditions
Block untested/bypassable critical invariants.