# EF Core N+1 Safety Rules

## MUST
- Measure query count before and after optimization using the same representative scenario.
- Verify returned business data is equivalent after the change.
- Treat static scanner findings as hypotheses until runtime or test evidence confirms scaling behavior.
- Preserve authorization filters, tenant scope, ordering, pagination, null semantics, and tracking requirements.
- Keep automated retry/test reruns bounded to two transient failures.
- Require explicit approval for schema changes, production configuration/deployment, breaking APIs, or large dependency upgrades.
- Record remaining risks and representative dataset assumptions.

## MUST NOT
- Claim N+1 solely because multiple SQL statements were observed.
- Replace N+1 with an unbounded `Include` graph or giant cartesian join without measuring the new behavior.
- Move filtering from SQL to client memory merely to reduce query count.
- Disable authorization/tenant filters for performance.
- Change API result cardinality or ordering unless explicitly required.
- Log sensitive SQL parameter values or connection strings.
- Modify production databases/configuration without approval.

## SHOULD
- Prefer projections that fetch only required columns when the result is read-only.
- Prefer batching/preloading keyed data over per-item repository calls.
- Test at more than one collection size to distinguish constant-query patterns from query growth with N.
- Inspect generated SQL for complex replacements.
- Add a regression test that asserts a bounded query count when the repository test infrastructure supports interception.
