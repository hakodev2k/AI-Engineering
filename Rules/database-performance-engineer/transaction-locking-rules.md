# Transaction and Locking Rules
## Purpose
Control contention while preserving transactional correctness.
## Scope
Transactions, isolation, locks, latches, blocking, and concurrency behavior.
## MUST
- Keep transaction scope no broader or longer than correctness requires.
- Diagnose blocking with wait, lock, and transaction evidence before changing isolation or access patterns.
- Validate concurrency-sensitive changes under representative contention.
## MUST NOT
- Lower isolation or remove locking safeguards merely to improve throughput without correctness analysis.
- Hold database transactions open across avoidable external network calls.
## SHOULD
- Establish deterministic resource access ordering where it reduces deadlock risk.
## Exceptions
Alternative concurrency models require documented invariants, failure modes, and approval for material correctness risk.
## Verification
Inspect transaction boundaries, lock graphs, wait telemetry, concurrency tests, and correctness tests.