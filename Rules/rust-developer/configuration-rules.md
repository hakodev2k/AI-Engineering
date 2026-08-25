# Configuration

## Purpose
Keep runtime configuration explicit, validated, secure, and environment-independent.

## Scope
Environment variables, config files, feature flags, command-line options, and runtime settings.

## MUST
- Configuration MUST be parsed and validated before dependent components start.
- Missing or invalid safety-critical configuration MUST fail closed with actionable diagnostics.
- Secrets MUST be separated from non-secret configuration and loaded through approved mechanisms.
- Configuration precedence MUST be deterministic and documented.

## MUST NOT
- MUST NOT embed production credentials, endpoints, or environment-specific secrets in source code.
- MUST NOT silently coerce invalid values into unsafe defaults.
- MUST NOT expose secret values in debug formatting or startup logs.

## SHOULD
- Use typed configuration models and explicit defaults.
- Make risky runtime toggles auditable and reversible.

## Exceptions
Dynamic configuration requires validation, consistency semantics, rollback behavior, and operational ownership.

## Verification
Run startup/configuration tests, inspect environment overrides, test invalid inputs, review redaction, and verify production change controls.