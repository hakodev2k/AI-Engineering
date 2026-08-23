# Logging Rules
## Purpose
Produce useful diagnostic records without creating security or cost hazards.
## Scope
Application, infrastructure, audit, and diagnostic logs.
## MUST
- Use structured fields for machine-relevant context.
- Include stable service/version/environment and correlation context where applicable.
- Define severity consistently and preserve unexpected failure diagnostics.
## MUST NOT
- Log secrets, authentication tokens, or unnecessary sensitive data.
- Use high-volume logs as a substitute for metrics.
## SHOULD
- Keep messages concise and put searchable dimensions in structured attributes.
## Exceptions
Temporary verbose logging requires bounded duration, access controls, and removal criteria.
## Verification
Inspect representative logs, secret scans, cardinality, retention, and query usefulness.