# Database Safety Rules

## MUST
- Preserve baseline and candidate plan evidence for every performance claim.
- Verify generated SQL when ORM query shape changed.
- Use representative parameters and comparable environments.
- Run relevant functional tests before accepting a performance fix.
- Stop for human approval before schema/index/migration/database configuration changes.
- Redact secrets, tokens, credentials, and unnecessary PII from evidence.
- Treat analyzer failure as blocking until explained or explicitly waived by a human.

## MUST NOT
- Run destructive SQL.
- Run `EXPLAIN ANALYZE` or equivalent executing diagnostics against production without explicit approval.
- Add/drop/rebuild indexes automatically.
- change production configuration or deploy to production automatically.
- Claim improvement from estimated cost alone when runtime evidence is required by acceptance criteria.
- Compare plans from materially different datasets/parameter classes and call the result verified.
- Disable a safety threshold merely to make the gate pass.

## SHOULD
- Prefer projection, sargable predicates, bounded result sets, and query-shape fixes before schema changes when evidence supports them.
- Capture DB duration, logical reads/buffers, rows, and application latency when available.
- Keep investigation facts, hypotheses, decisions, and open questions distinct.