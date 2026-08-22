# ML Testing Rules
## Purpose
Prevent regressions across code, data, models, and pipelines.
## Scope
Feature code, training, evaluation, serving, and orchestration.
## MUST
- Test deterministic transformation logic, schema assumptions, serialization, serving contracts, and critical pipeline boundaries.
- Add regression tests for confirmed production failures.
- Test failure paths for unavailable data, corrupt artifacts, and dependency timeouts where relevant.
## MUST NOT
- Depend solely on offline model metrics as software correctness evidence.
- Hide flaky tests with unbounded retries.
## SHOULD
- Use integration tests for training-serving compatibility and representative end-to-end paths.
## Exceptions
Expensive tests may run less frequently if critical gates retain equivalent protection.
## Verification
Inspect CI results, test determinism, failure-path coverage, and regression history.