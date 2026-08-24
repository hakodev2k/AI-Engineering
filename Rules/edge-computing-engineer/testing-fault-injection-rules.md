# Testing and Fault Injection
## Purpose
Validate edge behavior under the failures that distinguish edge environments.
## Scope
Automated, integration, system, hardware-in-loop, and resilience testing.
## MUST
- Critical paths MUST be tested for network loss, restart, resource pressure, stale state, and dependency failure where applicable.
- Tests MUST assert externally meaningful outcomes, not merely absence of exceptions.
- Regression tests MUST cover confirmed high-impact defects.
## MUST NOT
- MUST NOT treat happy-path cloud-connected tests as sufficient production evidence.
- MUST NOT run destructive fault injection against production without explicit human approval and safeguards.
## SHOULD
- Hardware-in-loop testing SHOULD cover platform-specific risks before broad rollout.
## Exceptions
Unavailable physical hardware requires documented simulation limits and later validation plan.
## Verification
Review CI suites, fault matrices, deterministic fixtures, hardware test results, and regression coverage.