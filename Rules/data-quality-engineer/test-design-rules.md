# Data Quality Test Design Rules
## Purpose
Create tests that detect meaningful failures with stable evidence.
## Scope
Unit, integration, contract, reconciliation, regression, and end-to-end data tests.
## MUST
- Tests MUST map to explicit risks or invariants and state expected failure behavior.
- Critical transformations MUST have tests for normal, boundary, missing, duplicate, and malformed inputs where applicable.
- Tests MUST be deterministic or explicitly account for bounded nondeterminism.
## MUST NOT
- MUST NOT rely only on happy-path row-count checks.
- MUST NOT mark flaky quality tests as acceptable without remediation ownership.
## SHOULD
- Test suites SHOULD balance fast local checks with representative integration coverage.
## Exceptions
Expensive tests may run less frequently when risk and detection latency are documented.
## Verification
Review test-risk traceability, failure fixtures, CI history, flake rate, and mutation/regression evidence where useful.