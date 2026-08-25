# Code Quality and Refactoring Rules
## Purpose
Control complexity while preserving behavior.
## Scope
Production code, shared libraries, and material refactors.
## MUST
- Refactors MUST preserve externally required behavior unless a contract change is intentional and reviewed.
- Complex logic MUST expose cohesive responsibilities and testable boundaries.
- Significant duplication MUST be evaluated for shared invariants before abstraction.
## MUST NOT
- MUST NOT combine unrelated architecture changes with urgent fixes without justification.
- MUST NOT introduce abstraction solely to reduce line count.
## SHOULD
- Prefer simple explicit designs over metaprogramming when both satisfy requirements.
## Exceptions
Generated or framework-constrained code may follow different maintainability criteria.
## Verification
Diff review, regression tests, complexity/static checks, and contract tests.