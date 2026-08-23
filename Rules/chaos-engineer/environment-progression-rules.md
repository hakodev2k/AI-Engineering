# Environment Progression Rules
## Purpose
Increase experiment realism without unnecessary production risk.
## Scope
Local, test, staging, canary, and production environments.
## MUST
- Validate fault mechanism and cleanup in a safer environment before production when representative testing is possible.
- Document material differences that limit pre-production evidence.
## MUST NOT
- Claim staging proves production resilience when topology, scale, or dependencies materially differ.
- Skip safer validation solely for convenience.
## SHOULD
- Progress from isolated to representative to production scope based on evidence.
## Exceptions
Production-only failure modes require stronger approval and blast-radius controls.
## Verification
Review prior runs, environment differences, and progression decisions.