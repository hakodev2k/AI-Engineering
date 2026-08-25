# Research — MCP OAuth Poisoned Provider Recovery Guard

## Topic
Recovering long-lived MCP OAuth clients when cached authentication-provider state becomes permanently unhealthy.

## Category
Performance

## Problem
Long-lived agent gateways can recover a failed MCP transport while reusing the same OAuth provider object. If that provider contains corrupted lock/auth-flow state, every reconnect can fail or time out indefinitely even though the remote MCP server and credentials are healthy. Operators see repeated reconnect attempts, growing latency, and integrations that remain parked until the whole process restarts.

## Why it matters now
Recent 2026 reports tie this failure to production MCP deployments using Python SDK OAuth flows, concurrent token refresh, cached provider instances, and long-lived gateways. Fresh processes often reconnect immediately while the existing process remains stuck, proving that transport-only retry is insufficient for some failure classes.

## Affected users
Agent-platform operators; MCP client authors; long-lived gateways/daemons; developers using OAuth-backed MCP servers such as Notion or Linear; teams running multi-server concurrent connections.

## Current public evidence

### Observed evidence
1. modelcontextprotocol/python-sdk issue #2847 (2026-06-12) reports confirmed production `anyio.Lock` failures in `async_auth_flow` under concurrent OAuth connections. The issue identifies a lock held across async-generator `yield` points and reports aborted requests/reconnects. https://github.com/modelcontextprotocol/python-sdk/issues/2847
2. python-sdk issue #2644 (2026-05-19) independently describes the same cross-task generator/lock invariant failure under OAuth refresh and notes intermittent production occurrence. https://github.com/modelcontextprotocol/python-sdk/issues/2644
3. NousResearch/hermes-agent issue #84132 (2026-08-11) reports an OAuth MCP server parking indefinitely after auth-flow lock corruption because reconnects rebuild the transport but reuse the same cached provider; a fresh process with a fresh provider connects in about two seconds while the long-lived gateway logs 150–316 warnings/day. https://github.com/NousResearch/hermes-agent/issues/84132
4. hermes-agent issue #81051 (2026-08-07) reports OAuth-backed MCP connections permanently parked after a teardown lock race, with full gateway restart as the only recovery. https://github.com/NousResearch/hermes-agent/issues/81051
5. hermes-agent issue #77765 (2026-08-03) reports HTTP+OAuth MCP reconnect timeouts continuing in a long-lived gateway while a fresh process connects successfully. https://github.com/NousResearch/hermes-agent/issues/77765
6. python-sdk issue #3257 (2026-08-05) reports an independent indefinite-reconnect failure shape where reconnection-attempt state can be reset, defeating the intended maximum-attempt bound. https://github.com/modelcontextprotocol/python-sdk/issues/3257

### Interpretation
These reports do not imply all OAuth reconnect failures share one SDK bug. They show a broader operational invariant: retry loops must distinguish transport failure from provider-state failure, must have bounded attempts, and must be able to rotate/recreate the authentication provider before escalating to process restart.

## Existing approaches
- Reconnect transport/session with fixed or exponential backoff.
- Cache an OAuth provider and token store for long-lived reuse.
- Retry token refresh.
- Restart the whole gateway when a connection remains parked.
- Apply downstream SDK patches to lock handling.

## Remaining limitations
- Transport recreation may retain the poisoned provider instance.
- Backoff limits request rate but does not repair state.
- A gateway restart repairs the provider but disrupts unrelated MCP servers and active work.
- Retry loops can become effectively unbounded.
- Operators often lack provider-generation, last-success, lock-error, and retry-budget metrics.
- A single transient failure and a deterministic poisoned-state failure can look identical in logs.

## Root-cause analysis
1. **Recovery-scope mismatch:** only transport/session state is rebuilt while auth-provider state survives.
2. **Stateful OAuth concurrency:** token refresh and async auth flows carry mutable lock/context state across tasks.
3. **Missing provider generation:** no observable identity proves a reconnect used fresh auth state.
4. **Unbounded retry semantics:** reconnect loops may reset counters or park forever.
5. **Weak liveness verification:** reconnect success is not compared with a fresh-provider control path.

## Improvement opportunity
Add a provider-aware recovery supervisor that classifies lock/auth-flow signatures separately from ordinary network failures, tracks provider generations, rotates provider state when poisoning is suspected, bounds transport retries, opens a circuit instead of retrying forever, and records before/after recovery latency.

## Proposed solution
This package provides a dependency-free JSONL trace analyzer/state machine, policy configuration, baseline/recovery skill, enforceable performance rules, independent investigator role, diagnosis and benchmark workflows, a reconnect preflight hook, and regression tests.

The script is intentionally credential-free: it does not read token files or perform OAuth. Hosts integrate its state machine around their existing OAuth provider factory and execute the returned actions (`retry_transport`, `recreate_provider`, `open_circuit`, `healthy`).

## Goal
Restore OAuth-backed MCP integrations without whole-process restart while preventing endless reconnect loops.

## Metrics
Time-to-recovery; reconnect attempts/server; provider recreations; circuit-open count; p50/p95 connect latency; parked duration; warnings/hour; percentage recovered without process restart; unrelated-server disruption count; successful fresh-provider health checks.

## Trigger
Any repeated OAuth-backed MCP connect/refresh timeout, lock ownership error, auth-flow exception, or parked state in a long-lived process.

## Inputs
Timestamped JSONL events containing server ID, event type, provider generation, optional latency/error text.

## Outputs
Per-server state, recommended recovery action, retry budget, provider generation, metrics, and final health status.

## Verification
Implemented means supervisor/policy/docs/tests exist. Measured means a baseline and recovery trace are compared. Verified means lock-poison fixtures force provider recreation, retries are bounded, healthy success resets failure counters, and one server's circuit state never affects another server.

## Relevant sources
- https://github.com/modelcontextprotocol/python-sdk/issues/2847
- https://github.com/modelcontextprotocol/python-sdk/issues/2644
- https://github.com/NousResearch/hermes-agent/issues/84132
- https://github.com/NousResearch/hermes-agent/issues/81051
- https://github.com/NousResearch/hermes-agent/issues/77765
- https://github.com/modelcontextprotocol/python-sdk/issues/3257
