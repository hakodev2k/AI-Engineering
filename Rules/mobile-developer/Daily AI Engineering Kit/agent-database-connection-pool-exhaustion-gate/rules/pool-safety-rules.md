# Database Connection Pool Safety Rules

## MUST
- Dispose `DbConnection`, provider connections, commands, readers, and manually-created `DbContext` instances on every path using `using` or `await using` as appropriate.
- Keep `DbContext` scoped to a unit of work; verify DI lifetime before editing database code.
- Bound fan-out concurrency when each operation may acquire a database connection.
- Preserve cancellation through async database APIs where supported.
- Keep transactions as short as practical and avoid unrelated network I/O while a transaction holds a connection.
- Record evidence for every high-risk scanner finding before declaring it resolved or false positive.
- Run targeted tests and inspect the final diff before `pass`.
- Require independent verification for high/critical findings.

## MUST NOT
- Register `DbContext` or mutable database connection objects as singleton services.
- Replace async database work with `.Result`, `.Wait()`, or other sync-over-async blocking in request/job/consumer paths.
- Increase `Max Pool Size`, reduce connection timeouts, or modify production connection strings merely to hide connection leaks or excessive concurrency.
- Add unbounded `Task.WhenAll`, `Parallel.ForEach`, or worker fan-out around database work without a concurrency budget.
- Add infinite or effectively unbounded retry loops around connection/database failures.
- Hold a transaction open while calling HTTP APIs, queues, file systems, or other slow external systems unless the architecture explicitly requires it and approval/evidence exists.
- Run destructive SQL, schema changes, production configuration changes, or infrastructure changes without explicit human approval.
- Treat a scanner match as confirmed fact without reading the code in context.

## SHOULD
- Prefer provider-managed pooling with normal disposal semantics instead of custom connection reuse.
- Measure acquisition latency, active/idle connections, request concurrency, retry counts, and DB latency when observability is available.
- Use bounded queues/semaphores or worker limits for bursty workloads.
- Prefer one connection-owning unit of work per logical operation unless the provider/framework documents a different safe pattern.
- Add regression tests that exercise cancellation, exceptions, and concurrent execution where those paths can leak or retain connections.
