# Testing Rules
## Purpose
Provide deterministic regression evidence for critical behavior.
## Scope
Unit, integration, contract, and end-to-end tests.
## MUST
- Critical business and failure paths MUST have automated regression coverage.
- Tests MUST control time, randomness, network, and external state when determinism requires it.
- Bug fixes MUST add regression evidence when practical.
## MUST NOT
- MUST NOT accept flaky tests as normal CI noise.
- MUST NOT mock away the behavior a test claims to validate.
## SHOULD
- Favor fast unit tests plus realistic boundary integration tests.
## Exceptions
Non-automatable checks require documented manual evidence and owner.
## Verification
Repeat CI runs, mutation/coverage signals where useful, and review of failure-path tests.