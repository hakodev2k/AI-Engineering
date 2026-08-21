# Research — MCP Memory Growth Regression Guard

## Problem
Long-running MCP TypeScript clients and servers can retain memory across repeated catalog refreshes or request handling instead of reaching a stable heap plateau. The failure mode is especially damaging in agent infrastructure because MCP processes are intentionally long-lived, tool catalogs may refresh repeatedly, and production gateways may serve large request volumes.

## Category
Performance.

## Why it matters now
The MCP TypeScript SDK has fresh August 2026 reports showing more than one independent retention path. These are not generic Node.js tuning complaints: they are lifecycle and validation behaviors inside common MCP execution paths, and they can turn ordinary refresh/request loops into heap growth, process aborts, or OOM restarts.

## Current public signals

### Signal 1 — output-schema validator recompilation is retained
GitHub issue `modelcontextprotocol/typescript-sdk#2605`, opened 2026-08-02, reports that `AjvJsonSchemaValidator.getValidator()` recompiles schemas without `$id` on every call. The reporter measured 12.4 MB retained after 40 rounds over 50 tools on SDK 1.30.0, versus 0.2 MB with a content-cache fix, and states that a real long-running client walked into its memory limit and aborted. The report attributes retention to AJV's compiled validator scope rather than the client's bounded tool-name map.

Source: https://github.com/modelcontextprotocol/typescript-sdk/issues/2605

### Signal 2 — reused `McpServer` can accumulate an `onclose` chain
GitHub issue `modelcontextprotocol/typescript-sdk#2607`, opened 2026-08-02, reports that `createMcpHandler` wraps `server.onclose` per handled request when the factory returns the same server instance. Repeated reuse grows a callback chain and reportedly ends in an uncatchable `RangeError` after roughly 20k requests.

Source: https://github.com/modelcontextprotocol/typescript-sdk/issues/2607

### Signal 3 — production stateless allocation pattern already showed slow memory growth
Earlier issue `modelcontextprotocol/typescript-sdk#2090` describes a production Kubernetes MCP gateway with a 1200 MiB limit growing around 1–2% memory per hour until OOMKill. Its benchmark compared per-request `McpServer` allocation with a lightweight dispatcher and reported lower retained heap and higher throughput for the latter. The issue also explains why naïvely reusing one mutable protocol/server instance can be unsafe under concurrent transports.

Source: https://github.com/modelcontextprotocol/typescript-sdk/issues/2090

### Signal 4 — official validator contract expects reusable compiled validators
The TypeScript SDK validator documentation says validator implementations should handle schema compilation/caching internally and return validator functions that can be reused multiple times. That makes repeated compilation of unchanged schemas a meaningful deviation from the intended performance shape rather than an unavoidable cost.

Source: https://ts.sdk.modelcontextprotocol.io/interfaces/validation.jsonSchemaValidator.html

## Existing approaches
1. Rely on garbage collection and container memory limits.
2. Restart MCP processes periodically.
3. Add `$id` to JSON Schemas so AJV can reuse a compiled validator.
4. Reuse server instances to reduce per-request allocation.
5. Create a fresh server per request to isolate transports.
6. Replace the default validator provider or patch SDK internals.
7. Inspect heap snapshots manually after a production incident.

## Observed limitations
- GC cannot reclaim objects still reachable through AJV scopes or callback chains.
- Periodic restarts hide the leak and convert it into operational churn; they do not prove a safe steady state.
- Adding `$id` can mitigate one validator path but does not cover unrelated lifecycle retention and requires schema-governance discipline.
- Reusing a mutable `McpServer` can itself create lifecycle hazards; per-request construction can also retain memory or reduce throughput.
- A one-time heap snapshot is hard to interpret without a repeatable workload, warm-up, forced-GC checkpoints, and a slope threshold.
- SDK patches may change behavior across versions, so teams need a regression gate independent of a specific upstream fix.

## Root-cause hypotheses
These hypotheses must be tested, not assumed:
1. **Schema compilation retention:** unchanged schemas are compiled repeatedly and retained in a validator engine.
2. **Lifecycle callback accumulation:** request/session setup mutates persistent callback state without replacing or removing earlier wrappers.
3. **Per-request object retention:** server/protocol/transport objects remain reachable after requests complete.
4. **Unbounded catalog churn:** genuinely dynamic schemas create an intentionally growing cache that still needs an eviction/recycle policy.
5. **Transport/reconnect retention:** timers, listeners, inflight sets, or streams outlive the logical request/session.

## Improvement target
Provide a reusable engineering package that detects memory-growth regressions before production and separates symptom measurement from diagnosis. It should:
- establish a post-warm-up baseline;
- measure heap after explicit GC when available;
- calculate retained-heap slope per operation and per 1k operations;
- distinguish plateau from monotonic growth;
- capture reproducible workload metadata;
- provide probes for catalog refresh and request lifecycle;
- require evidence before selecting a mitigation;
- verify the mitigation with the same workload;
- fail CI when configured regression thresholds are exceeded.

## Success metrics
Primary:
- retained heap growth after warm-up, MB / 1k operations;
- end-to-start post-GC heap delta;
- slope confidence / consistency across sampled windows;
- crash/OOM occurrence;
- throughput and p95 latency to detect fixes that trade leaks for severe slowdown.

Secondary:
- validator compilations per unchanged schema generation;
- listener/callback count growth;
- active handles after workload completion;
- heap snapshot retained-object fingerprints.

## Evidence classification
**Observed:** the cited issues contain reproductions and measured growth for validator compilation, callback chaining, and stateless server allocation patterns.

**Interpretation:** MCP deployments need a cross-version regression harness because multiple independent mechanisms can produce the same operational symptom: non-plateauing heap.

**Proposed engineering solution:** the package's measurement, probes, rules, workflows, and CI gates. It is not an upstream claim and should be validated against each target application.

## Sources
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2605
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2607
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2090
- https://ts.sdk.modelcontextprotocol.io/interfaces/validation.jsonSchemaValidator.html
- https://ts.sdk.modelcontextprotocol.io/v2/advanced/schema-libraries
