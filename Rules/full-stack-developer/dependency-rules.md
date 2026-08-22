# Dependency Rules

## Purpose
Control security, compatibility, maintenance, and supply-chain risk.
## Scope
Frontend packages, backend libraries, SDKs, build tools, and runtime dependencies.
## MUST
- Evaluate maintenance status, license, security posture, transitive impact, and necessity before material adoption.
- Pin or constrain versions according to ecosystem best practice and use reproducible lock mechanisms.
- Review major upgrades for breaking behavior across affected layers.
## MUST NOT
- Add a dependency for trivial functionality without considering lifecycle cost.
- Ignore known critical vulnerabilities without documented risk treatment.
## SHOULD
- Remove unused dependencies and automate vulnerability/update visibility.
## Exceptions
Temporary vulnerable dependency acceptance requires owner, expiry, compensating controls, and approval.
## Verification
Dependency manifests, lockfiles, scanners, license checks, and upgrade tests.