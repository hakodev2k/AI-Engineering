# Research — MCP Server Lifecycle Leak Regression Guard

## Topic
MCP Server Lifecycle Leak Regression Guard

## Category
Performance

## Problem
MCP HTTP serving code can fail in two opposite ways: creating a full server/protocol stack per request can produce costly allocation/GC pressure, while reusing a server instance can accumulate lifecycle callbacks or violate transport-isolation assumptions. A recent v2 report shows `createMcpHandler` wrapping `server.onclose` repeatedly when a shared server is returned, causing unbounded closure growth and an eventual stack overflow after roughly 19k–25k sessions.

## Why it matters now
The current TypeScript MCP SDK documents fresh server construction per request for stateless HTTP serving. At the same time, production reports describe significant per-request allocation overhead, making instance reuse an attractive but unsafe optimization. The August 2026 v2 lifecycle-chain issue demonstrates that the optimization can delay failure until sustained load, where normal request checks remain green until shutdown or cleanup triggers a crash.

## Affected users
Teams operating TypeScript MCP servers/gateways under sustained HTTP load, serverless/container deployments, platform teams tuning memory/throughput, and developers migrating to v2 `createMcpHandler`.

## Current public evidence
### Observed evidence
1. TypeScript SDK issue #2607, opened 2026-08-02, reports reused `McpServer` instances causing an unbounded `onclose` wrapper chain, memory growth, and `RangeError` around 19k–25k accumulated sessions: https://github.com/modelcontextprotocol/typescript-sdk/issues/2607
2. Issue #2090, opened 2026-05-14, reports production memory growth and benchmarked overhead from creating full `McpServer`/Protocol/transport objects per stateless request, with 2,797 req/s versus 6,536 req/s for a lightweight dispatcher and greater heap growth in that workload: https://github.com/modelcontextprotocol/typescript-sdk/issues/2090
3. Earlier issue #1699 documents stack overflow/unresponsiveness during concurrent transport closure, showing lifecycle/close behavior is a production-sensitive failure surface even though that specific issue is closed: https://github.com/modelcontextprotocol/typescript-sdk/issues/1699
4. Current SDK serving documentation says `createMcpHandler` builds a fresh server instance from the factory for every HTTP request and recommends keeping the factory cheap and side-effect-free while moving pools/caches to module scope: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/http.md
5. The SDK's sessions/scaling documentation reiterates that stateless `createMcpHandler` builds a fresh server per request and holds no state between requests: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/sessions-state-scaling.md
6. A February 2026 security advisory also warns that sharing server/transport instances can leak cross-client response data in affected SDK versions, reinforcing that reuse is not merely a performance decision: https://github.com/modelcontextprotocol/typescript-sdk/security/advisories/GHSA-345p-7cg4-v4c7

## Existing approaches
- Fresh server instance per request, with shared expensive dependencies captured outside the factory.
- Reuse a single server to reduce allocations.
- Increase memory limits or rely on GC.
- Load-test only steady-state request latency/status codes.
- Restart processes periodically after memory growth.

## Remaining limitations
Fresh-per-request is safe for isolation but can be expensive if server construction performs schema compilation or allocates heavy dependencies. Shared-server reuse may violate lifecycle assumptions and can fail only after thousands of requests. Status-code-only load tests miss retained closures, heap slopes, and shutdown-stack failures. Periodic restarts hide rather than diagnose regressions.

## Root-cause analysis
- Server object lifecycle is conflated with reusable business dependencies.
- Factories can accidentally capture/return singleton server instances without immediate errors.
- Load tests often stop before teardown, so delayed close-chain crashes are invisible.
- Heap snapshots/slopes are not routinely included in MCP regression suites.
- Performance optimization is attempted by reusing protocol-bearing objects instead of reusing safe dependency pools/caches/compiled application data.

## Improvement opportunity
Create a reusable lifecycle performance gate that (1) fails fast when a factory returns the same server object twice, (2) records heap/latency/request counts during a bounded load test, (3) requires explicit teardown/shutdown verification, and (4) compares before/after metrics against configured thresholds. Keep database clients, HTTP pools, caches, and immutable tool definitions reusable outside the per-request server instance.

## Goal
Prevent unsafe server-instance reuse and detect lifecycle memory/teardown regressions before production while preserving measurable performance targets.

## Metrics
- Duplicate server-instance count = 0 in stateless request factories.
- Heap growth slope within configured MB/1k-request threshold after warmup.
- No `RangeError`, unhandled rejection, or close failure at teardown.
- p95 latency and throughput compared to baseline.
- Factory construction cost measured separately from shared dependency initialization.

## Trigger
MCP SDK upgrade, stateless serving refactor, throughput/memory optimization, production memory alert, shutdown failure, or change to the `createMcpHandler` factory.

## Inputs
Load-test JSONL metrics, factory implementation, server identity observations, heap samples, request latency, error/teardown status, thresholds, and baseline measurements.

## Outputs
Pass/block decision, duplicate-instance findings, heap slope, latency/throughput summary, teardown verdict, and regression reasons.

## Interpretation
The public reports are workload-specific and do not prove that all fresh-per-request deployments leak. They do show a real optimization trap: unsafe reuse can create delayed lifecycle failure, while heavy per-request construction can create measurable allocation pressure. Both require evidence-driven benchmarking.

## Proposed solution
A fail-fast fresh-factory wrapper plus a deterministic lifecycle-metrics analyzer, enforced by rules, a bounded benchmark workflow, a pre-release hook, and independent verification.