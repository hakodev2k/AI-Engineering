# Local Development Rules
## Purpose
Keep local execution reproducible and close enough to supported runtime behavior to expose meaningful failures early.
## Scope
Local services, dependencies, emulators, configuration, startup, shutdown, and cleanup.
## MUST
- Local environments MUST declare required dependencies, versions, ports, and configuration sources.
- Startup and cleanup MUST be repeatable without undocumented manual repair.
- Material divergence from production semantics MUST be documented and tested elsewhere.
- Local tooling MUST fail clearly when prerequisites are absent.
## MUST NOT
- MUST NOT require production data or production credentials for routine development.
- MUST NOT hide dependency failures behind misleading success states.
- MUST NOT make destructive host changes without explicit consent.
## SHOULD
- Dependencies SHOULD be isolated and version-pinned where practical.
- Fast paths SHOULD preserve the same contracts as full environments.
## Exceptions
Exceptions require reason, risk, alternative, owner, and verification; production-data access requires explicit approval and controls.
## Verification
Exercise clean startup/shutdown, inspect configuration and network dependencies, run representative tests, and compare documented divergences with integration environments.