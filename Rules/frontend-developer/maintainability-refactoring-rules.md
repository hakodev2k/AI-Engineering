# Maintainability and Refactoring Rules
## Purpose
Control frontend complexity while preserving behavior and delivery safety.
## Scope
Refactoring, duplication, abstraction, legacy code, and technical debt.
## MUST
- Refactors MUST define behavior intended to remain unchanged and verify critical behavior before and after.
- Abstractions MUST represent stable shared concepts rather than coincidental code similarity.
- Technical-debt changes MUST identify risk reduced or future cost avoided when they compete with product work.
- Large migrations MUST have incremental compatibility boundaries and rollback/stop criteria where practical.
## MUST NOT
- Refactoring MUST NOT silently alter public behavior or contracts.
- Legacy code MUST NOT be rewritten wholesale solely for stylistic preference without evidence of benefit and risk control.
## SHOULD
- Remove obsolete abstractions after consumers migrate to avoid parallel architectures.
## Exceptions
Small behavior changes may accompany refactors when explicitly identified and tested.
## Verification
Diff review, regression tests, complexity/dependency evidence where useful, and consumer compatibility checks.