# AI Testing Rules
## Purpose
Protect AI workflows from deterministic and probabilistic regressions.
## Scope
Unit, integration, end-to-end, evaluation, adversarial, and production-like testing.
## MUST
- Test deterministic application logic separately from model behavior.
- Maintain regression cases for known failures, critical paths, safety boundaries, and integration contracts.
- Control model version, parameters, fixtures, and external dependencies sufficiently to interpret test failures.
- Test malformed, empty, adversarial, ambiguous, and dependency-failure inputs where relevant.
## MUST NOT
- Require exact text equality for inherently variable outputs unless exact output is a true contract.
- Ignore flaky AI tests without diagnosing whether variance reflects model, data, environment, or test-design issues.
## SHOULD
- Use semantic assertions, rubrics, statistical thresholds, or human review appropriate to the task.
## Exceptions
Reduced coverage requires documented risk and compensating validation.
## Verification
Inspect test suites, regression datasets, evaluation thresholds, CI history, and failure triage evidence.