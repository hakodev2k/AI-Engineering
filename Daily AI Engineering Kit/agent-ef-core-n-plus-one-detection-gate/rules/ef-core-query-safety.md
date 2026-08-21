# EF Core Query Safety Rules

## MUST
- Correlate repeated SQL with a concrete request/job and code call site before declaring N+1.
- Preserve authorization filters, tenant boundaries, paging, ordering, and null semantics.
- Compare before/after logs using the same scenario and representative input size.
- Run relevant tests after query changes.
- Require explicit human approval for production query/config changes, schema/index changes, breaking API changes, and global lazy-loading changes.
- Preserve evidence for every failed verification attempt.

## MUST NOT
- Do not fix N+1 by loading an unbounded table or collection into memory.
- Do not add `Include` indiscriminately when a projection or batch query is sufficient.
- Do not change tracking behavior unless the task requires it and tests cover the difference.
- Do not execute destructive SQL or migrations.
- Do not silence EF Core warnings to make the gate pass.
- Do not infer query performance solely from generated SQL without execution evidence.

## SHOULD
- Prefer projections for read models.
- Prefer bounded batching for key lookups.
- Keep the number of round trips constant relative to collection size when feasible.
- Add query-count regression coverage for critical paths.
