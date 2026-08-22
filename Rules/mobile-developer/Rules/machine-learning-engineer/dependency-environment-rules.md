# Dependency and Environment Rules
## Purpose
Control reproducibility, compatibility, and supply-chain risk.
## Scope
ML libraries, runtimes, drivers, containers, hardware dependencies, and external services.
## MUST
- Pin or otherwise reproducibly resolve production-critical dependencies.
- Validate major runtime, framework, driver, or accelerator upgrades against training and inference behavior.
- Scan dependencies and container images for known vulnerabilities.
## MUST NOT
- Perform large dependency migrations in production without compatibility evidence and approval.
- Assume numerically identical behavior across environments without validation when it affects acceptance thresholds.
## SHOULD
- Keep training and serving environments intentionally aligned or document validated differences.
## Exceptions
Urgent security upgrades may use accelerated validation with explicit risk ownership.
## Verification
Inspect lockfiles, images, SBOM/scans, environment metadata, and compatibility tests.