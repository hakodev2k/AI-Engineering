# Code Quality and Dependency Rules

## Purpose
Keep automation maintainable enough that safety-critical behavior can be understood, reviewed, and changed confidently.

## Scope
Automation code, modules, libraries, parsers, plugins, dependencies, refactoring, and public interfaces.

## MUST
- Safety-critical logic MUST have explicit interfaces, tests, and error behavior.
- Parsing, transformation, transport, policy, and orchestration concerns MUST be separable enough to test independently.
- Dependency additions or major upgrades MUST evaluate maintenance, compatibility, security, and operational impact.
- Public automation interfaces and data contracts MUST preserve compatibility or provide a migration path.
- Refactors affecting network semantics MUST prove behavioral equivalence or document intentional differences.

## MUST NOT
- MUST NOT hide device mutations inside helpers presented as read-only or pure transformations.
- MUST NOT duplicate policy logic across platform branches when divergence can create inconsistent safety behavior.
- MUST NOT accept dependency-generated behavior changes without review and regression evidence.

## SHOULD
- Complexity SHOULD be reduced at orchestration boundaries before adding more conditional platform logic.
- Static analysis and type/schema checks SHOULD enforce defects that can be detected deterministically.

## Exceptions
Temporary duplication or compatibility shims require owner, rationale, tests, removal condition, and documented risk.

## Verification
Use code review, static analysis, dependency scanning, contract tests, mutation-boundary inspection, regression tests, and comparison of pre/post-refactor generated plans.