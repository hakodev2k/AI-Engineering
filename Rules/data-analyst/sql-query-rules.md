# SQL Query Rules

## Purpose
Ensure analytical SQL is correct, reviewable, and efficient enough for its workload.

## Scope
Ad hoc queries, reusable models, extracts, and report queries.

## MUST
- Make join keys, filter logic, grain, and aggregation explicit.
- Detect one-to-many and many-to-many joins that can duplicate measures.
- Use deterministic ordering when row order affects downstream logic.
- Parameterize reusable queries where supported.
- Review query cost and execution behavior for large or recurring workloads.

## MUST NOT
- MUST NOT use `SELECT *` in governed analytical outputs without a documented reason.
- MUST NOT rely on implicit type conversion for critical comparisons.
- MUST NOT hide duplicate elimination with `DISTINCT` before understanding its cause.

## SHOULD
- Prefer clear staged logic over opaque monolithic queries.

## Exceptions
Small exploratory queries may trade optimization for speed if they are not promoted to recurring production use.

## Verification
Review SQL, row-count transitions, join cardinality, query plans where relevant, and known-result test cases.