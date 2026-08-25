# Configuration and Environment Rules
## Purpose
Keep runtime behavior explicit across environments.
## Scope
Environment variables, configuration files, feature flags, and runtime settings.
## MUST
- Required configuration MUST be validated at startup or before first use.
- Environment-specific values MUST be externalized from reusable source code.
- Security-sensitive defaults MUST fail closed.
## MUST NOT
- MUST NOT silently fall back to production-unsafe values for missing critical configuration.
- MUST NOT mix test, staging, and production credentials or endpoints.
## SHOULD
- Use typed configuration models and documented defaults.
## Exceptions
Optional features may use safe defaults with clear observability.
## Verification
Startup tests, configuration schema checks, deployment diff, and environment inspection.