# Research Evidence

## Topic
MCP Capability Retry Circuit Breaker

## Category
Performance

## Problem
AI agent hosts can repeatedly call optional MCP methods that a server does not implement, or keep retrying failed discovery/refresh calls without bounded backoff. The result is sustained idle CPU, I/O, log volume, process churn, and UI/app-server degradation even after user work stops.

## Why it matters now
MCP adoption has expanded agent hosts from a few tools to long-lived plugin ecosystems. A capability mismatch that would once produce a harmless one-time error can now become a persistent retry storm across desktop, remote app-server, and IDE surfaces.

## Affected users
Developers using Codex/Claude-style agent hosts, MCP plugin authors, remote development users, IDE extension users, and platform teams operating long-lived agent processes.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39483 reports a remote Linux app-server consuming about 1.2–1.3 CPU cores while idle. Logs showed `resources/list` and `resources/templates/list` returning MCP `-32601 Method not found` every 3–5 seconds, plus repeated installed-app refresh traffic and ongoing SQLite WAL writes.
2. OpenAI Codex issue #22393 reports repeated optional MCP resource-discovery `-32601` errors among a larger extension/app-server event storm; the issue explicitly recommends treating unsupported optional capabilities as a quiet degraded mode rather than repeated extension errors.
3. OpenAI Codex issue #39134 documents a separate but related unbounded retry/loading pattern where failed remote list requests left the renderer near 100% CPU until the sidebar was collapsed, reinforcing the need for bounded retries, stale/error states, and explicit user-triggered recovery.

### Interpretation
A `Method not found` response for an optional capability is not a transient failure. Retrying it on a fixed cadence without capability-state memory turns a protocol mismatch into a resource leak. Generic retry infrastructure often lacks semantic classification and therefore treats permanent unsupported responses like temporary network failures.

## Existing approaches
- MCP capability negotiation during initialization.
- Generic retry with exponential backoff.
- Logging unsupported-method failures.
- Restarting the app-server or disabling the plugin manually.
- UI loading/error states.

## Remaining limitations
- Hosts may probe methods not explicitly advertised by the server.
- Retry systems often classify by transport failure rather than protocol semantics.
- Unsupported-state knowledge may not persist across refresh loops or reconnects.
- Multiple refresh subsystems can independently re-trigger the same failing call.
- Operators often notice only after CPU, I/O, WAL growth, or UI responsiveness degrade.

## Root-cause analysis
1. No durable per-server capability state derived from initialization plus observed protocol errors.
2. `-32601` is not treated as a terminal unsupported-capability signal.
3. Retry policy is shared between transient and permanent failures.
4. Refresh loops lack global attempt budgets and circuit-breaker state.
5. No idle-resource SLO verifies that failed discovery settles back to baseline.

## Improvement opportunity
Add a capability-aware retry circuit breaker that records supported/unsupported/unknown method state per server instance, suppresses retries after deterministic unsupported responses, uses bounded exponential backoff for genuinely transient failures, deduplicates concurrent refresh requests, and verifies that idle CPU/I/O return to baseline.

## Relevant sources
- https://github.com/openai/codex/issues/39483
- https://github.com/openai/codex/issues/22393
- https://github.com/openai/codex/issues/39134
