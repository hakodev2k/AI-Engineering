# Test Environment Rules
## Purpose
Prevent false conclusions caused by environment drift or uncontrolled dependencies.
## Scope
QA, staging, ephemeral environments, configuration, services, and external dependencies.
## MUST
- Record environment version, configuration assumptions, dependency state, and relevant feature flags for release-critical evidence.
- Detect material differences from the target production environment.
- Distinguish product defects from environment failures with evidence.
## MUST NOT
- Claim production readiness from an environment known to omit a material production dependency without risk analysis.
- Silently change shared environment configuration to make tests pass.
## SHOULD
- Automate environment health checks and reproducible provisioning where feasible.
## Exceptions
Substitute dependencies are acceptable when their behavioral limitations are documented and separately covered.
## Verification
Compare environment manifests, configuration, dependency versions, health checks, and execution records.