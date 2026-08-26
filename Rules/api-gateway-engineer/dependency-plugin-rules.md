# Dependencies and Plugins

## Purpose
Control the reliability, security, and lifecycle risk introduced by gateway extensions and dependencies.

## Scope
Plugins, modules, filters, runtime libraries, container images, and third-party extensions.

## MUST
- Every production plugin MUST have an owner, supported version, purpose, and compatibility evidence.
- Dependency updates MUST be assessed for security, behavior, performance, and rollback impact.
- Untrusted extensions MUST be evaluated before receiving access to requests, credentials, or sensitive traffic.
- Large dependency or plugin migrations MUST require explicit review and staged validation.

## MUST NOT
- MUST NOT install unsupported plugins merely to avoid implementing a safer supported approach.
- MUST NOT execute arbitrary extension code from unverified sources.
- MUST NOT ignore known critical vulnerabilities without documented risk treatment.

## SHOULD
- Dependency sets SHOULD be minimal and pinned according to project policy.
- Extensions SHOULD expose health and failure signals where practical.

## Exceptions
Exceptions require reason, vulnerability/operational assessment, compensating controls, owner, and approval.

## Verification
Run dependency and vulnerability scans, inspect provenance, compatibility tests, performance tests, plugin inventory, and rollback evidence.