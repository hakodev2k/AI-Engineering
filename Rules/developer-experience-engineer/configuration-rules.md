# Configuration Rules
## Purpose
Keep developer tooling configuration explicit, validated, secure, and evolvable.
## Scope
Repository configuration, environment variables, defaults, feature flags, user overrides, and shared settings.
## MUST
- Configuration MUST have documented precedence, validation, and safe defaults.
- Invalid configuration MUST fail with actionable diagnostics before unsafe side effects.
- Sensitive values MUST be separated from ordinary configuration and stored through approved secret mechanisms.
- Configuration schema changes MUST assess backward compatibility.
## MUST NOT
- MUST NOT silently ignore unknown security-critical configuration.
- MUST NOT commit production secrets or personal credentials.
- MUST NOT make environment-dependent behavior impossible to identify from effective configuration.
## SHOULD
- Effective configuration SHOULD be inspectable with sensitive values redacted.
- Configuration SHOULD be minimized in favor of stable conventions when that does not hide important behavior.
## Exceptions
Legacy formats require documented migration, compatibility scope, risk, and removal criteria.
## Verification
Run schema validation, precedence tests, redaction checks, compatibility tests, configuration diff inspection, and representative environment tests.