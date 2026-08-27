# Research — MCP Lifecycle Retry and Health State Machine
**Topic:** transient or stale lifecycle failures become session-long MCP outages  
**Category:** Performance  
**Research date:** 2026-08-28 (UTC+7)

## Problem
MCP clients may treat a single initialization failure, timeout, or stale subprocess observation as a permanent session failure. This removes tools even when a retry or health reconciliation would show the server is usable.

## Why it matters now
Two recent independent public reports show different transports but the same architectural gap.

## Affected users
Developers using MCP from coding agents, platform teams operating remote MCP endpoints, and users relying on local stdio MCP servers.

## Current public evidence
### Observed evidence
1. GitHub Copilot CLI issue #4466, opened 2026-08-12, reports that a transient HTTP 5xx such as `502 Bad Gateway` during remote MCP `initialize` marks the server failed for the entire session with no retry/backoff.  
   https://github.com/github/copilot-cli/issues/4466
2. Hermes Agent issue #95867, opened 2026-08-26, reports local stdio MCP servers that complete handshake, list tools, remain alive, and answer ping, yet subsequent calls fail because the client believes the subprocess exited.  
   https://github.com/NousResearch/hermes-agent/issues/95867
3. GitHub Copilot CLI issue #4370, opened 2026-08-04, shows an initialization compatibility error (`server/discover` returning an error) being treated as fatal, reinforcing the need to distinguish protocol incompatibility from transient transport failure.  
   https://github.com/github/copilot-cli/issues/4370

### Interpretation
The shared problem is lifecycle state collapse: distinct evidence classes (transient network, protocol incompatibility, stale process handle, confirmed death) map too quickly to one terminal `failed` state.

## Existing approaches
- Single initialization attempt at session start.
- Generic request timeout.
- Cached failed state.
- Manual reconnect/restart.
- Transport-level ping/health checks in some implementations.

## Remaining limitations
- No typed retry policy by failure class.
- Session-long caching of transient failure.
- Stdio process-handle state may diverge from actual server liveness.
- Retry loops can amplify load unless bounded with backoff/jitter.
- Generic retries can hide protocol incompatibility or authentication errors.

## Root-cause analysis
1. Lifecycle errors lack a normalized taxonomy.
2. `failed` is used where `degraded/retryable` is more accurate.
3. Health evidence is not reconciled before terminal transition.
4. Retry budget is not explicit.
5. Baseline time-to-ready and recovery-rate metrics are often absent.

## Improvement opportunity
Introduce an explicit state machine: `new -> initializing -> ready | degraded | failed`. Retry only transient HTTP 5xx/timeouts and stale-handle cases with evidence of liveness. Treat auth and protocol errors as terminal until configuration changes. Cap attempts and emit measurable retry decisions.

## Relevant sources
- https://github.com/github/copilot-cli/issues/4466
- https://github.com/NousResearch/hermes-agent/issues/95867
- https://github.com/github/copilot-cli/issues/4370
