# Code Review Rules

## Purpose
Make React code review a Senior-level quality gate for correctness, maintainability, security, accessibility, and production impact.

## Scope
Applies to pull requests and change reviews affecting frontend code, tests, dependencies, configuration, and contracts.

## MUST
- Reviewers MUST evaluate behavior, state ownership, lifecycle effects, data contracts, accessibility, security, tests, and production impact as relevant to the change.
- High-risk changes MUST include evidence such as tests, screenshots, profiling, network traces, or reproducible verification appropriate to the risk.
- Review comments that block merge MUST identify the violated requirement or concrete risk.
- Large changes MUST be reviewed for hidden scope growth, duplicated abstractions, and migration impact.
- Contract, dependency, security, or architecture changes MUST receive review from an appropriately knowledgeable owner when required.

## MUST NOT
- MUST NOT approve solely because the code compiles or the happy path works.
- MUST NOT use style preference as a blocking argument when established standards permit the code.
- MUST NOT ignore known flaky tests, accessibility regressions, or security concerns to meet a deadline without explicit risk approval.

## SHOULD
- Prefer small reviewable changes with clear intent and verification evidence.
- Prefer comments that explain risk and expected outcome rather than prescribing unnecessary implementation detail.

## Exceptions
Emergency review shortcuts require explicit approval, documented residual risk, and follow-up review.

## Verification
Inspect PR evidence, test results, changed dependencies/configuration, accessibility impact, contract compatibility, and unresolved review threads before merge.