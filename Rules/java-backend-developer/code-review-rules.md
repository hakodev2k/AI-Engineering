# Code Review Rules

## Purpose
Make review a risk-control mechanism for correctness, architecture, security, operability, and maintainability.

## Scope
Applies to Java backend pull requests and technical reviews.

## MUST
- Review MUST evaluate behavior, failure modes, compatibility, security, data impact, and operational consequences proportional to change risk.
- High-risk changes MUST include evidence such as tests, migration plans, benchmarks, query plans, threat analysis, or rollout plans as relevant.
- Review comments that identify correctness or safety blockers MUST be resolved before merge.
- Generated code and AI-produced changes MUST receive the same evidence and ownership standards as human-written code.
- Large changes MUST be decomposed or accompanied by review guidance sufficient to make critical behavior inspectable.

## MUST NOT
- MUST NOT approve solely because CI is green.
- MUST NOT waive review for urgent changes without an authorized emergency process and retrospective review.
- MUST NOT accept unexplained broad refactoring mixed into high-risk functional changes when it obscures review.

## SHOULD
- Focus review effort on invariants, boundaries, concurrency, data, security, and production risk rather than cosmetic preferences handled by automation.

## Exceptions
Trivial automated changes may use streamlined review if policy explicitly permits and risk is bounded.

## Verification
Inspect PR evidence, reviewer coverage, unresolved discussions, CI checks, diff scope, ownership rules, and post-merge auditability.