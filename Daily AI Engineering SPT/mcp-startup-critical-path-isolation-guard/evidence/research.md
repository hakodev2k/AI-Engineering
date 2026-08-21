# Research — MCP Startup Critical-Path Isolation Guard

## Problem
AI coding/agent clients can place MCP server startup, authentication probing, connector hydration, and tool discovery on the application startup or first-turn critical path. A single slow or unavailable optional server can therefore delay the whole session even when the user does not need that server.

## Category
Performance.

## Why it matters now
The problem is recurring across current agent clients rather than being a single historical bug. Developers increasingly configure multiple local and remote MCP servers, which multiplies startup dependencies on processes, package managers, DNS, VPN, OAuth, browser connectors, and remote services.

## Current public signals

### Observed evidence 1 — Codex startup/tool discovery can block first turn
OpenAI Codex issue #21318, opened 2026-05-06, reports that with many MCP servers configured, startup or the first turn can become slow or appear stuck, especially when servers are slow, unauthenticated, unreachable, or expensive to start. The requested behavior is incremental availability rather than blocking interaction until every optional server is ready.

Source: https://github.com/openai/codex/issues/21318

### Observed evidence 2 — roughly 30-second MCP path even without user MCPs
OpenAI Codex issue #28556, opened 2026-06-16, reports `codex mcp list` and startup-health paths taking about 30 seconds, including a reproduction with no user-configured MCP servers. This is a strong signal that MCP/connectors can become a user-visible latency component independent of actual task requirements.

Source: https://github.com/openai/codex/issues/28556

### Observed evidence 3 — startup regression measured above five seconds
OpenAI Codex issue #26992, opened 2026-06-08, reports a startup regression around Codex CLI 0.137.0 and measures startup/MCP-list delays above five seconds across multiple releases.

Source: https://github.com/openai/codex/issues/26992

### Observed evidence 4 — eager MCP/App connector initialization
OpenAI Codex issue #24397, opened 2026-05-25, attributes slow startup to eager initialization of MCP servers, Apps/Connectors, or browser-related plugins even when those integrations are not used in the session.

Source: https://github.com/openai/codex/issues/24397

### Observed evidence 5 — shared network failures amplify timeout noise
OpenAI Codex issue #35611, opened 2026-07-27, explains that several MCP servers can fail together behind a VPN, proxy, private DNS, or route issue. Merely increasing each server's startup timeout can make the critical path longer without fixing the shared cause.

Source: https://github.com/openai/codex/issues/35611

### Observed evidence 6 — Claude Code reconnect/startup state can be unavailable
Anthropic Claude Code issue #83429, opened 2026-08-03, reports MCP reconnect controls intermittently unavailable while the extension terminal is still starting, and separately notes multiple `npx`-based MCP servers racing on shared npm cache during concurrent startup.

Source: https://github.com/anthropics/claude-code/issues/83429

## Official protocol constraints
The MCP lifecycle specification requires initialization and capability negotiation before normal operation for a particular client-server connection, but it does not require an application to wait for every configured server before becoming usable. It also recommends request timeouts to avoid hung connections and resource exhaustion.

Source: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle

## Existing approaches
1. Configure a larger `startup_timeout_sec` for slow servers.
2. Disable unused MCP servers manually.
3. Remove expensive integrations from default configuration.
4. Start servers in parallel.
5. Retry/reconnect after startup failure.
6. Ask users to repair VPN, DNS, auth, or package-manager failures.

## Observed limitations
- Increasing timeouts helps genuinely slow healthy servers but worsens time-to-ready when the server is unreachable or blocked by a shared network problem.
- Manual enable/disable does not scale when tool demand changes per task.
- Parallel startup lowers sum latency but can still block on the slowest server if readiness requires all servers.
- Parallel `npx` startup can introduce contention or package-cache races.
- Retry without a bounded policy can convert one slow dependency into repeated startup cost.
- A single global timeout does not distinguish required versus optional integrations.
- Startup success alone is insufficient; the application needs metrics that separate core readiness, MCP readiness, and first useful turn.

## Interpretation
The architectural failure is not simply “MCP is slow.” It is coupling optional integration readiness to the user/session critical path. The reusable improvement is to make readiness dependency-aware and incremental.

## Root-cause hypotheses
1. All configured integrations are treated as mandatory during startup.
2. Tool discovery is performed eagerly instead of on demand or in the background.
3. Readiness state is binary (`starting`/`ready`) rather than per-server and degraded-capable.
4. Timeouts are global instead of server-class and request-specific.
5. Retry policy is not coordinated across servers sharing the same network/auth dependency.
6. There is insufficient instrumentation for startup phase attribution.
7. Expensive process launch/package resolution is repeated instead of pooled or warmed.

## Improvement target
Create a reusable guard that enforces:
- core session readiness independent of optional MCP readiness;
- explicit required/optional server classification;
- bounded concurrent initialization;
- per-server deadlines and backoff;
- degraded-ready state with incremental tool registration;
- on-demand activation for cold servers;
- circuit breaking for repeated failures;
- startup phase metrics and regression gates;
- deterministic verification that a failed optional server cannot exceed the core readiness SLO.

## Success metrics
- `core_ready_ms` p50/p95/p99.
- `first_prompt_accepted_ms`.
- `first_useful_turn_ms`.
- per-server `initialize_ms`, `discover_ms`, `auth_ms`.
- percentage of sessions blocked by optional servers; target 0%.
- number of MCP processes launched before first user demand.
- startup retry count and timeout count.
- degraded-ready rate and later recovery rate.
- CPU/memory/process count during cold startup.
- regression threshold: core-ready p95 must not worsen by more than 10% from approved baseline.

## Proposed engineering solution
A dependency-aware startup controller with four server classes: `required`, `background`, `on_demand`, and `disabled`. Only `required` servers participate in the core readiness barrier. Background servers initialize under bounded concurrency after core readiness. On-demand servers initialize only when a task requires one of their capabilities. Each server has a deadline, retry budget, failure cooldown, and independent state machine. A benchmark script records cold/warm metrics, while a readiness evaluator fails CI if optional-server failure leaks into the core critical path.

## Quality-gate result
- Real current problem: yes.
- Multiple independent public signals: yes.
- Allowed category: Performance.
- Existing approaches have meaningful limitations: yes.
- Concrete reusable improvement: yes.
- Measurable verification: yes.
- Distinct from recent packages: yes; this package targets startup critical-path coupling, not schema token budget, memory growth, workspace scanning, background-process cancellation, or retry idempotency.
