# EF Core Query Investigation Rules

## MUST
- Preserve user-visible behavior unless the requirement explicitly changes it.
- Capture the LINQ/query source, generated SQL, parameters or parameter shapes, provider, EF Core version, and relevant model configuration before proposing a fix.
- Distinguish application latency from database execution latency.
- Compare before/after evidence using the same workload shape whenever possible.
- Inspect tracking mode, projection shape, includes, split/single query behavior, pagination, filters, joins, client evaluation risks, indexes, cardinality, and execution-plan operators relevant to the symptom.
- Add or update a behavioral test for any code change.
- Inspect the final git diff and list unresolved risks.
- Stop for explicit human approval before any schema/index change, production configuration change, query hint, dependency upgrade, or write-capable raw SQL.

## MUST NOT
- Treat a hypothesis as a confirmed root cause without evidence.
- Add `AsNoTracking`, `AsSplitQuery`, indexes, caching, raw SQL, or compiled queries merely because they are common optimizations.
- Change database schema, indexes, statistics, compatibility level, isolation settings, or production configuration automatically.
- Benchmark different result sets and call the comparison valid.
- Remove filters, authorization predicates, tenant constraints, or concurrency checks for performance.
- Hide failures by increasing timeouts before root cause is understood.
- Execute destructive SQL.

## SHOULD
- Prefer the smallest change that addresses the measured bottleneck.
- Prefer server-side projection over materializing unnecessary entities.
- Keep provider-specific advice isolated and clearly identified.
- Record facts, hypotheses, decisions, and evidence separately.
- Re-run the exact failing/slow scenario after each accepted change.
