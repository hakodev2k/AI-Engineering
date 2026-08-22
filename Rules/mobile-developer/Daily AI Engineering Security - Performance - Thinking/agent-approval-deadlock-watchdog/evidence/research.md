# Research — Agent Approval Deadlock Watchdog

## Problem
Agent runtimes increasingly depend on human approval gates for shell commands, filesystem escalation, MCP calls, plan transitions, and subagent actions. A recurring failure mode is **approval liveness loss**: the runtime has a pending permission request, but the approval surface is missing, disconnected, mislabeled, or never propagated. The agent then stalls indefinitely, silently skips work, or treats “pending” as “denied”.

## Category
**Thinking** — this package improves execution reliability through explicit state, evidence, bounded waiting, recovery, and verification. It does not ask the model to “reason harder”.

## Why it matters now
Recent public reports across Codex and Claude Code show the same structural failure on different surfaces: app-server, desktop/terminal, background agents, VS Code, and multi-agent workflows.

## Current public signals

### Signal 1 — Codex app-server approval not surfaced
OpenAI Codex issue #21982 (2026-05-09) reports a turn stalled on a sandbox escalation visible in the transcript while no matching `requestApproval` JSON-RPC request reached the app-server client. The client therefore had no way to display or resolve the approval until timeout.

Source: https://github.com/openai/codex/issues/21982

### Signal 2 — Claude Code stuck permission requests need timeout semantics
Claude Code issue #37913 (2026-03-23) requests a configurable permission-request timeout because autonomous/background sessions can wait for hours on unnoticed prompts. The report notes that notification hooks alone do not resolve the permission state.

Source: https://github.com/anthropics/claude-code/issues/37913

### Signal 3 — hidden permission prompt can hang Bash indefinitely
Claude Code issue #62292 (2026-05-25) reports Bash showing `Waiting...` while no approval UI appears; the tool stayed blocked for 18+ minutes with no timeout or recoverable error.

Source: https://github.com/anthropics/claude-code/issues/62292

### Signal 4 — subagent permission gate not propagated
Claude Code issue #61315 (2026-05-20/21 observations) reports subagents silently blocking on MCP permission gates that did not surface in the parent CLI. Observed stalls lasted roughly 28 and 58 minutes.

Source: https://github.com/anthropics/claude-code/issues/61315

### Signal 5 — pending can be reported as denied
Claude Code issue #37158 (2026-03-21) describes `ExitPlanMode` returning permission denied without presenting an approval UI. The report argues that pending user input was effectively represented as denial, changing agent behavior and confusing both sides.

Source: https://github.com/anthropics/claude-code/issues/37158

## Observed evidence
- Approval requests can exist without a usable UI surface.
- Background/subagent approval requests can fail to propagate to the controller.
- Waiting can be unbounded.
- A notification is not equivalent to a decision channel.
- Pending, denied, expired, disconnected, and unresolved states can be conflated.

## Interpretation
Approval should be modeled as a durable, correlated state machine rather than inferred from UI behavior or tool text. The controller needs evidence that every permission-gated action reaches a terminal state within a bounded window, or that a clear recovery/escalation path runs.

## Existing approaches
### Interactive approval UI
Works when the request reaches the correct client and the user is present.

**Limitation:** multiple reports show the request can fail before rendering or fail to propagate across app-server/subagent boundaries.

### Notifications/hooks
Useful for awareness.

**Limitation:** notification hooks may be informational only; they do not necessarily resolve the underlying request.

### Disabling approvals / broad bypass modes
Can prevent waiting.

**Limitation:** this weakens safety boundaries and is unacceptable as a generic recovery mechanism. Some reports also show permission behavior may differ between parent and subagent contexts.

### Manual interruption/restart
Restores progress in some cases.

**Limitation:** loses continuity, requires operator attention, and does not classify root cause.

## Proposed engineering solution
A deterministic approval watchdog that consumes runtime approval events and enforces:
1. globally unique request correlation;
2. explicit states: `requested`, `surfaced`, `acknowledged`, `approved`, `denied`, `expired`, `cancelled`, `orphaned`;
3. a **surface deadline** distinct from a **decision deadline**;
4. detection of missing parent/child propagation;
5. no conversion of timeout into approval;
6. bounded retry of notification/surface delivery only;
7. safe terminal fallback to deny/cancel/escalate;
8. structured evidence without sensitive command contents.

## Root-cause hypotheses
- event routing drops or misroutes approval requests;
- UI lifecycle is disconnected from runtime request lifecycle;
- subagent controllers do not inherit or proxy permission channels;
- pending state is represented as a generic error/deny;
- no watchdog owns liveness across tool runner, UI, and controller boundaries;
- session/background execution lacks an attended-user signal.

## Success metrics
- 100% of gated actions have a correlated approval request ID;
- 100% of requests reach a terminal state or explicit escalation within configured deadlines;
- zero silent waits beyond `decision_timeout_seconds + grace_seconds`;
- zero timeout paths result in implicit approval;
- orphaned approval rate is measurable and trends toward zero;
- median and p95 request-to-surface latency are recorded;
- median and p95 request-to-decision latency are recorded separately;
- recovery does not weaken permission policy.

## Improvement target
Turn “agent appears stuck” into a deterministic diagnosis such as `SURFACE_TIMEOUT`, `DECISION_TIMEOUT`, `ORPHAN_RESULT`, `DUPLICATE_TERMINAL`, or `MISSING_PARENT_ROUTE`, with a safe recovery action and an auditable event trail.

## Sources
1. OpenAI Codex #21982 — https://github.com/openai/codex/issues/21982
2. Anthropic Claude Code #37913 — https://github.com/anthropics/claude-code/issues/37913
3. Anthropic Claude Code #62292 — https://github.com/anthropics/claude-code/issues/62292
4. Anthropic Claude Code #61315 — https://github.com/anthropics/claude-code/issues/61315
5. Anthropic Claude Code #37158 — https://github.com/anthropics/claude-code/issues/37158
