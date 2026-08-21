# Engineering Rules

## MUST
- MUST measure repository-scan overhead separately from actual tool execution before optimizing.
- MUST attach every full-root scan to an explicit reason and repository/worktree identity.
- MUST enforce bounded scan frequency and concurrency in host/orchestrator code where possible.
- MUST invalidate cached inventories on correctness-relevant repository events.
- MUST preserve detection of newly created, deleted, renamed, or checked-out files used by the task.
- MUST fail or surface a blocking alert when equivalent scans exceed configured budgets.
- MUST preserve negative evidence such as slow scans, denied-path traversal, and over-budget concurrency in reports.
- MUST compare before/after metrics on the same representative scenarios.
- MUST keep inactive-project scanning distinct from active-task scanning in telemetry.
- MUST require review before increasing scan budgets or widening scan roots.

## MUST NOT
- MUST NOT treat high CPU/disk as proof that the model itself is looping; attribute the scanning component first.
- MUST NOT disable Git/ripgrep/sandbox discovery globally merely to make latency disappear.
- MUST NOT use unbounded time-based inventory caching.
- MUST NOT silently ignore task-relevant paths to meet a performance target.
- MUST NOT automatically recurse into dependency/generated directories for bookkeeping when the operation does not require them.
- MUST NOT allow multiple equivalent scanners to run concurrently without explicit justification.
- MUST NOT count a faster tool command as an optimization if pre-tool scanning moved elsewhere and total latency did not improve.
- MUST NOT auto-relax thresholds after a regression failure.

## SHOULD
- SHOULD fingerprint scans by repo, worktree, scope, reason, scanner, and ignore-policy version.
- SHOULD prefer event-driven invalidation over repeated polling/full-tree discovery.
- SHOULD expose scan count, elapsed time, concurrency, and scope in observability dashboards.
- SHOULD use sparse/task-local scope where correctness permits.
- SHOULD distinguish user-requested search from host-maintenance scanning.
- SHOULD benchmark monorepos and dependency-heavy repositories, not only small fixtures.
- SHOULD maintain a small correctness corpus containing add/delete/rename/checkout/ignore-rule scenarios.
- SHOULD cap diagnostic and optimization retries at three or fewer iterations.