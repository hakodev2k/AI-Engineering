# Cache Safety Rules

## MUST
- Map every changed mutation that affects cached data to its invalidation/update/versioning path.
- Record cache key scope, including tenant/user dimensions where applicable.
- Test a read after mutation for every changed cached contract.
- Preserve evidence for scanner findings, tests, and verification results.
- Use `needs-approval` before any production cache flush, destructive reset, shared namespace change, production configuration change, or breaking API contract.
- Prefer targeted invalidation or versioned keys over broad cache clearing.
- Treat failed invalidation after a successful durable write as a correctness scenario that requires explicit handling or documented bounded staleness.

## MUST NOT
- Flush production Redis or another shared production cache during automated verification.
- Introduce `FLUSHALL`, `FLUSHDB`, broad wildcard deletion, or equivalent destructive operations as a default fix.
- Assume TTL alone makes a stale-data bug acceptable without an explicit consistency contract.
- Remove tenant/user/authorization dimensions from a cache key without explicit approval and tests proving isolation.
- Mark `pass` when relevant tests were not run, failed, or the assessment contract is invalid.
- Hide an inconclusive cache ownership relationship by calling it low risk.
- Silently change cache TTL, production configuration, or cache infrastructure to make a test pass.

## SHOULD
- Keep invalidation near the authoritative mutation boundary or emit a reliable domain/integration event when cross-service invalidation is required.
- Include list/detail/summary/permission/search derivatives in fan-out analysis.
- Use transactional outbox or another durable handoff where invalidation depends on an external message after a database commit.
- Add race-focused tests for concurrent readers when repopulation can occur between mutation and invalidation.
- Keep cache keys deterministic and observable enough to diagnose invalidation failures without exposing secrets.
