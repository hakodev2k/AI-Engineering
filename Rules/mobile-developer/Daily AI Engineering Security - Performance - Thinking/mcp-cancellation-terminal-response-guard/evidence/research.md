# Research — MCP Cancellation Terminal Response Guard

## Topic
MCP Cancellation Terminal Response Guard

## Category
Performance

## Problem
MCP tool requests can become permanently pending when cancellation, timeout, or transport failure stops server work but does not produce a terminal response that releases the client-side request slot. Cancellation errors can also be misclassified as timeouts, causing inappropriate retries. The result is a wedged session, leaked in-flight state, unnecessary reconnects, repeated model/tool work, and poor recovery behavior.

## Why it matters now
MCP is increasingly used as the tool boundary for coding and enterprise agents. Recent public issues in Codex, Claude Code, VS Code Copilot, and the MCP TypeScript SDK show that timeout/cancellation behavior still varies across implementations and can leave requests hanging or blur user cancellation with timeout failure.

## Affected users
MCP client/server authors, coding-agent users, agent platform teams, developers operating long-running tools, and systems using parallel MCP calls or shared MCP sessions.

## Current public evidence
### Observed evidence
1. **OpenAI Codex issue #20925**, published in 2026, reports that `notifications/cancelled` stops an in-flight Codex MCP tool’s work but the original `tools/call` is never resolved. The client must kill the server process to recover, losing other active thread state. Source: https://github.com/openai/codex/issues/20925
2. **OpenAI Codex issue #32470, opened July 11, 2026**, reports a Streamable HTTP MCP session wedging after a tool call loses its completion event; later calls to the same MCP server also remain pending even though a fresh independent session succeeds. Source: https://github.com/openai/codex/issues/32470
3. **MCP TypeScript SDK issue #2165, opened May 28, 2026**, reports that an explicit `AbortSignal` cancellation is surfaced as `REQUEST_TIMEOUT`, preventing callers from distinguishing user cancellation from a real timeout and causing retry messaging/logic to fire incorrectly. Source: https://github.com/modelcontextprotocol/typescript-sdk/issues/2165
4. **VS Code Copilot issue #14130, opened February 16, 2026**, requests configurable MCP tool timeouts because a slow or stuck tool can leave Agent Mode waiting indefinitely. Source: https://github.com/microsoft/vscode-copilot-release/issues/14130
5. **MCP SEP-1539 Timeout Coordination** identifies the need to distinguish timeout-triggered cancellations and coordinate timeout semantics between requesters and receivers. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1539
6. MCP Inspector documents client request timeout, timeout reset on progress, and maximum-total-timeout controls, showing that bounded request lifetime is already considered operationally important. Source: https://github.com/modelcontextprotocol/inspector

## Existing approaches
- Client-side generic request timeouts.
- `notifications/cancelled` to tell the peer work is no longer needed.
- Process/session restart after a stuck call.
- Transport-level close/reconnect.
- Retry on timeout-like exceptions.
- Progress notifications that reset idle timeout.

## Remaining limitations
- Sending cancellation does not itself prove that the original request reached a terminal state.
- Timeout and explicit/user cancellation can share the same error class in some SDKs, leading to wrong retry decisions.
- Killing a shared server/session can disrupt unrelated in-flight or persistent state.
- Idle timeout alone can kill legitimately long-running work unless progress semantics and an absolute deadline are both represented.
- A transport reconnect can create ambiguity about whether remote work is still running.
- Retry without terminal reconciliation can duplicate side effects or amplify load.

## Root-cause analysis
1. **Cancellation treated as a notification, not a state transition contract:** local code sends a cancel signal but does not require terminal acknowledgement/reconciliation for the request record.
2. **Error taxonomy collapse:** user abort, deadline expiry, transport loss, and server failure may map to the same generic exception.
3. **Missing absolute lifetime:** progress can extend an idle timer forever without a separate maximum deadline.
4. **Session-level recovery for request-level failure:** runtimes restart an entire server because they cannot isolate/reconcile one request.
5. **Retry before state reconciliation:** systems may start a new attempt while the old request remains unknown or remotely active.

## Improvement opportunity
Introduce a deterministic request-state guard around MCP calls:
- assign each call a durable correlation ID and deadline;
- track `pending → cancel_requested → terminal` or `unknown` states;
- distinguish `user_cancel`, `deadline_timeout`, `transport_loss`, `server_error`, and `completed` reasons;
- require a terminal response within a bounded cancellation grace period;
- if none arrives, mark the request `unknown`, quarantine retries for side-effecting tools, and perform request/session reconciliation;
- use idle timeout plus absolute maximum lifetime;
- allow shared sessions to continue only when protocol state is known healthy.

## Goal
Ensure every MCP request reaches a bounded, observable terminal or explicitly `unknown` state, preventing indefinite pending calls and unsafe retries.

## Metrics
- In-flight request age p50/p95/max.
- Percentage of requests with terminal outcome.
- Cancel-to-terminal latency.
- Count of `unknown` outcomes.
- Incorrect retry count by cancellation reason.
- Session restarts caused by one request.
- Duplicate side-effect incidents after timeout/cancel.
- Mean recovery time from a stuck request.

## Trigger
Every MCP `tools/call` start, cancellation request, idle timeout, absolute deadline, transport disconnect, or missing completion event.

## Inputs
Request/correlation ID, tool identity, side-effect classification, start time, idle/progress timestamps, absolute deadline, cancellation reason, transport/session identity, and observed terminal response.

## Outputs
State transition record, retry eligibility, session health decision, reason code, recovery action, and audit evidence.

## Interpretation
The evidence does not mean MCP itself requires indefinite waits. It shows that client/server implementations can fail to coordinate cancellation and terminal request lifecycle consistently, and that generic timeout handling is insufficient for safe automated recovery.

## Proposed solution
A reusable cancellation lifecycle contract plus deterministic watchdog that separates cancellation causes, enforces idle and absolute deadlines, waits only a bounded grace period for terminal response, and forbids automatic retry of side-effecting calls whose final state is unknown.

## Relevant sources
- https://github.com/openai/codex/issues/20925
- https://github.com/openai/codex/issues/32470
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2165
- https://github.com/microsoft/vscode-copilot-release/issues/14130
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1539
- https://github.com/modelcontextprotocol/inspector
