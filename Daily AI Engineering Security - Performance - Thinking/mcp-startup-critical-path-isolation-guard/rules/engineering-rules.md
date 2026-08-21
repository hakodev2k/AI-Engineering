# Engineering Rules

## MUST
- Every enabled MCP server MUST have an explicit startup class: `required`, `background`, `on_demand`, or `disabled`.
- Only `required` servers MAY participate in the core-readiness barrier.
- Every server initialization MUST have a finite deadline and bounded retry budget.
- Core readiness MUST be timestamped independently from full MCP readiness.
- Tool registration MUST occur only after that server completes MCP initialization/capability negotiation and discovery.
- Optional server failure MUST be represented explicitly as degraded capability; it MUST NOT silently block prompt acceptance.
- Required-server failure MUST remain visible and MUST fail the readiness contract when the missing capability is required for correctness or safety.
- Startup concurrency MUST be bounded.
- Per-server startup phases MUST be observable: start, transport connected, initialized, auth completed when applicable, discovery completed, ready/failed.
- Shared dependency failures such as VPN/DNS/proxy/package-cache failures MUST be diagnosed once and correlated across affected servers instead of independently extending all timeouts.
- Changes to startup logic MUST be compared against an approved baseline with repeated cold and warm measurements.
- CI/regression verification MUST inject at least one slow optional server and one unavailable optional server.
- Retry loops MUST stop after the configured maximum and enter cooldown or fail explicitly.
- Any change that moves a security, authorization, policy, or mandatory data-integrity dependency out of the required barrier MUST receive explicit human approval.

## MUST NOT
- Optional MCP servers MUST NOT delay `core_ready` or `first_prompt_accepted` beyond the configured SLO.
- The system MUST NOT wait for “all configured MCP servers” unless every one is genuinely required for the first valid turn.
- The system MUST NOT treat a larger timeout as a performance fix without measured evidence.
- The system MUST NOT start on-demand servers speculatively when no routed capability requires them, unless a documented prewarming policy justifies the cost.
- The system MUST NOT retry forever, restart a failing process in a tight loop, or create unbounded concurrent initializers.
- The system MUST NOT hide required-server failures by reporting `fully_ready`.
- The system MUST NOT publish tool schemas from a server before that server is actually usable.
- Benchmarks MUST NOT mix cold and warm measurements into one number.
- Credentials, bearer tokens, OAuth codes, cookies, or secret environment values MUST NOT appear in startup traces.
- A noisy single measurement MUST NOT be used to claim improvement.

## SHOULD
- Prefer background initialization for commonly useful but nonessential integrations.
- Prefer on-demand initialization for rare, expensive, remote, or auth-heavy integrations.
- Reuse already-running healthy local servers when safe rather than spawning redundant processes.
- Cache only non-secret discovery metadata when protocol/client semantics permit it, and invalidate on server/config/version change.
- Add jitter to retries when many clients may reconnect simultaneously.
- Use per-server timeouts based on observed behavior rather than one global number.
- Maintain a dependency map for servers that share npm cache, browser runtime, VPN, DNS, proxy, OAuth provider, or gateway.
- Surface degraded capability in UI/logs without turning it into startup-blocking noise.
- Track both latency and resource pressure (process count, CPU, memory) because excessive parallelism can improve latency while degrading the host.
- Review startup classification whenever a server gains a new mandatory responsibility.

## Observable invariants
1. `optional_block_count == 0` for an approved run.
2. `core_ready_ms <= core_ready_slo_ms` for the target percentile after normalization.
3. Slow optional server fault injection changes full-ready time but not core-ready time beyond allowed regression.
4. Failed required server never produces `fully_ready`.
5. Initializer concurrency never exceeds `max_parallel_initializers`.
6. Retry count per server never exceeds `max_retries_per_server`.
7. On-demand server process count remains zero before demand.
