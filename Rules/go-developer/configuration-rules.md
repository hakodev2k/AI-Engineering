# Configuration Rules

## Purpose
Make runtime configuration explicit, validated, secure, and environment-safe.

## Scope
Environment variables, files, flags, defaults, secrets references, and startup validation.

## MUST
- Required configuration MUST be validated before the service becomes ready.
- Defaults MUST be safe and documented for operationally significant settings.
- Secret values MUST be separated from ordinary configuration and never emitted in diagnostics.
- Configuration precedence MUST be deterministic.

## MUST NOT
- MUST NOT silently fall back to insecure values when required security configuration is absent.
- MUST NOT embed production credentials or environment-specific endpoints in source.
- MUST NOT accept malformed durations, limits, or addresses without validation.

## SHOULD
- Parse configuration into typed immutable structures near startup.
- Fail fast on invalid settings that prevent safe operation.

## Exceptions
Dynamic reload requires atomicity, validation, rollback behavior, and observability.

## Verification
Startup tests, invalid-config tests, secret scanning, configuration diff review, and environment-specific smoke tests.