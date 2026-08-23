# Release and Production Safety Rules

## Purpose
Prevent unverified firmware or irreversible device changes from reaching production.

## Scope
Release candidates, manufacturing images, field deployment, configuration, rollback, and production actions.

## MUST
- Define release acceptance evidence for critical functionality, compatibility, security, and recovery.
- Require authorized human approval before production deployment, irreversible device configuration, security-fuse changes, or destructive fleet actions.
- Preserve traceability from released binary to reviewed source and configuration.

## MUST NOT
- Ship debug credentials, test keys, unsafe feature flags, or unreviewed production overrides.
- Treat successful compilation as release readiness.

## SHOULD
- Stage rollouts and monitor failure indicators when field update infrastructure supports it.

## Exceptions
Emergency releases require documented risk, reduced checks, compensating validation, and approval.

## Verification
Inspect release checklist, signatures/hashes, provenance, test evidence, configuration, rollback plan, and approval records.