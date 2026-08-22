# Environment Integrity Rules

## Purpose
Ensure test conclusions are valid for the environment in which evidence was collected.
## Scope
Test environments, dependencies, configuration, versions, and external services.
## MUST
- Record material application versions, configuration, dependencies, feature flags, and data conditions for release-critical testing.
- Detect and report environment drift that can invalidate results.
- Distinguish product defects from environment failures using evidence.
## MUST NOT
- Report a passing result when required dependencies were bypassed without disclosure.
- Assume lower-environment behavior proves production equivalence.
## SHOULD
- Automate environment health and configuration checks before critical suites.
## Exceptions
Controlled stubs are acceptable when their contract and limitations are explicit.
## Verification
Compare environment manifests, health checks, logs, configuration, and dependency versions.