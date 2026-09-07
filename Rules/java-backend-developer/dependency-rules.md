# Dependency Rules

## Purpose
Control compatibility, security, supply-chain, and maintenance risk from Java dependencies.

## Scope
Applies to Maven/Gradle dependencies, plugins, BOMs, SDKs, and transitive libraries.

## MUST
- Dependencies MUST have a justified purpose, maintained provenance, and compatible license/security posture.
- Versions MUST be reproducible through lock, dependency-management, or equivalent controlled resolution mechanisms appropriate to the build.
- Major dependency upgrades MUST assess API, runtime, configuration, serialization, and operational compatibility.
- Known vulnerabilities MUST be triaged by exploitability and impact, not severity number alone.
- Build plugins and repositories MUST be treated as supply-chain execution boundaries.

## MUST NOT
- MUST NOT add overlapping libraries for convenience without considering footprint and maintenance cost.
- MUST NOT use untrusted artifact repositories or disable integrity/TLS controls.
- MUST NOT perform large dependency migrations in production-critical systems without review and staged verification.

## SHOULD
- Prefer actively maintained, widely understood libraries with minimal required surface.
- Remove unused direct dependencies.

## Exceptions
Temporary vulnerable or legacy dependencies require documented risk acceptance, compensating controls, owner, and expiry/remediation plan.

## Verification
Use dependency trees, SBOMs, vulnerability/license scanners, reproducible builds, integration tests, binary/API compatibility checks, and review of repository configuration.