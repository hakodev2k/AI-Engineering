# Engineering Rules

## MUST
- MUST establish a warmed, post-GC baseline before claiming a memory regression or improvement.
- MUST record Node version, MCP SDK version, workload type, concurrency, operation count, tool count, and schema count with every measurement.
- MUST use the same workload and thresholds for before/after comparison.
- MUST distinguish `heapUsed` growth from RSS/external-memory growth.
- MUST fail the regression gate when configured retained-MB/1k-op or total-growth thresholds are exceeded.
- MUST test correctness after any validator-cache, server-reuse, transport, listener, or lifecycle change.
- MUST preserve output validation; memory reduction is not a valid reason to skip schema validation.
- MUST verify concurrent transport/session correctness before reusing mutable server/protocol instances.
- MUST bound diagnosis retries to `config/policy.json:max_retries`.
- MUST record failed experiments and contradictory evidence.

## MUST NOT
- MUST NOT declare a leak from cold-start heap growth alone.
- MUST NOT declare a fix from RSS decreasing once, a single task-manager screenshot, or an unforced-GC sample when GC is required.
- MUST NOT hide monotonic growth with scheduled restarts and call the underlying defect fixed.
- MUST NOT add unbounded memoization to fix another unbounded retention path.
- MUST NOT assign synthetic schema `$id` values without ensuring stable content-to-ID semantics and collision handling.
- MUST NOT share a single mutable MCP protocol/server transport across concurrent requests unless the implementation explicitly supports it and tests prove isolation.
- MUST NOT remove listeners, callbacks, validators, or transport cleanup paths solely to reduce object counts without correctness tests.
- MUST NOT use unlimited load-test or retry loops.

## SHOULD
- SHOULD test catalog-refresh and request-lifecycle workloads independently before a mixed soak.
- SHOULD capture heap snapshots only after a deterministic growth signal exists.
- SHOULD prefer content-stable cache keys and bounded/recyclable caches when schema diversity is genuinely unbounded.
- SHOULD include throughput and p95 latency in memory-fix verification.
- SHOULD run the regression gate on MCP SDK upgrades and lifecycle/validator changes.
- SHOULD keep a known-good baseline artifact per supported runtime/SDK combination.
- SHOULD alert on slope, not only absolute memory, so slow leaks are caught before OOM.
