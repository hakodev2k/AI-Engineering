# Mocking and Service Virtualization Rules

## Purpose
Use doubles and virtualized dependencies without creating false confidence about real integrations.

## Scope
Applies to mocks, stubs, fakes, simulators, service virtualization, and recorded responses.

## MUST
- A test double MUST model only behavior required by the test boundary and documented contract.
- Critical external integrations MUST retain some verification against a real or contract-validated implementation.
- Simulated failures MUST reflect plausible protocol and business failure modes.
- Recorded responses MUST be reviewed for sensitive data and contract staleness.

## MUST NOT
- MUST NOT mock the system under test's own core behavior.
- MUST NOT infer integration compatibility solely because both sides use matching mocks.
- MUST NOT store secrets or production personal data in recordings.

## SHOULD
- Prefer deterministic fakes for unstable dependencies when integration is covered elsewhere.
- Version virtualized contracts with the dependency behavior they represent.

## Exceptions
Full virtualization may be used when real dependency access is impossible, with explicit residual-risk documentation.

## Verification
Compare doubles with contracts/real responses, inspect failure scenarios, scan recordings, and review integration coverage.