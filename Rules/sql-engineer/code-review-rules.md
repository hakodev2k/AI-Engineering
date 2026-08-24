# SQL Code Review Rules

## Purpose
Make review a substantive control for correctness, safety, performance, and operability.

## Scope
SQL pull requests, migration scripts, stored modules, schema changes, and operational scripts.

## MUST
- Review MUST evaluate result semantics, affected rows, null/duplicate behavior, transaction boundaries, concurrency, security, and production impact as relevant.
- Performance-sensitive SQL MUST include evidence sufficient to evaluate representative plans or measurements.
- High-risk changes MUST state rollback/recovery and verification procedures.
- Reviewers MUST inspect the actual SQL and schema dependencies rather than rely only on author summaries.

## MUST NOT
- MUST NOT approve destructive or breaking changes when scope or recovery is unclear.
- MUST NOT accept unexplained hints, privilege expansion, constraint removal, or broad scans on critical paths.
- MUST NOT use formatting cleanliness as a substitute for semantic review.

## SHOULD
- Request smaller changes when mixed concerns prevent reliable review.
- Use automated linting/tests to reserve human attention for judgment-heavy risks.

## Exceptions
Emergency review shortcuts require incident authorization and retrospective review.

## Verification
Check review evidence, CI results, execution plans/tests where relevant, migration safety notes, security impact, and explicit approval for dangerous actions.