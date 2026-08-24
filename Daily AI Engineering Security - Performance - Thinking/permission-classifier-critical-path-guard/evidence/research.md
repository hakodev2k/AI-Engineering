# Research — Permission Classifier Critical-Path Guard

## Topic
Permission-classifier critical-path latency and availability

## Category
Performance

## Problem
Agent runtimes increasingly insert a model-based safety/permission classifier between a proposed tool call and actual tool dispatch. When that classifier stalls, becomes unavailable, or reports misleading provider errors, the tool itself may be fast and healthy while the whole agent turn blocks for minutes or fails repeatedly. Generic tool-latency metrics frequently attribute the delay to the tool rather than to pre-execution authorization.

## Why it matters now
Claude Code's auto mode moved permission classification into the critical path of unattended tool use. Fresh August 2026 reports show multi-minute classifier waits, persistent classifier unavailability across machines/accounts, and extension hangs after classifier completion. These failures can dominate end-to-end session time while operators see little actionable attribution.

## Affected users
Developers running unattended/auto agent sessions, platform teams integrating model-based approval, MCP users, CI/headless agent operators, and engineering teams measuring agent latency or SLOs.

## Current public evidence

### Observed evidence
1. **2026-08-13 — anthropics/claude-code #86339.** Nine auto-mode permission decisions across three sessions took 305–329 seconds before tools executed normally; one session spent 31m11s of 46m09s in these stalls. A measured command executed in 1.4s inside a ~308s tool-use→result gap. https://github.com/anthropics/claude-code/issues/86339
2. **2026-08-04 — anthropics/claude-code #83773.** Auto-mode classifier reportedly remained unavailable for 2+ weeks across accounts, machines, operating systems, and CLI versions, blocking actions that reached the classifier path. https://github.com/anthropics/claude-code/issues/83773
3. **2026-08-10 — anthropics/claude-code #85411.** Repeated classifier unavailability blocked read-only MCP tools; five attempts with increasing delays produced the same error and zero output. https://github.com/anthropics/claude-code/issues/85411
4. **2026-07-26 — anthropics/claude-code #81425.** VS Code/Cursor sessions could hang after `classifier_request_finished` with no tool dispatch, prompt, error, or timeout; recovery by reopening chat could lose prompt-cache reuse and add token cost. https://github.com/anthropics/claude-code/issues/81425
5. **2026-08-07 — anthropics/claude-code #84673.** A regression could build five cache-control blocks for classifier requests, receive API 400, and surface the failure as model “temporarily unavailable,” demonstrating that visible outage text can misclassify a client/request construction failure. https://github.com/anthropics/claude-code/issues/84673
6. **2026-08-10 — anthropics/claude-code #85491.** Audited sessions lost time when the classifier blocked explicitly allowed read-only operations non-deterministically, showing additional friction at the permission path rather than the underlying tools. https://github.com/anthropics/claude-code/issues/85491

## Interpretation
The engineering gap is observability and bounded control of the authorization critical path. A host needs separate timestamps and outcomes for model decision, permission policy evaluation, UI/manual approval, dispatch, and actual tool execution. Without this decomposition, retry/backoff and SLO decisions operate on the wrong component.

## Existing approaches
- Tool-level duration metrics.
- Generic session/turn timers.
- Fixed classifier timeouts.
- Retry after “temporarily unavailable.”
- Switch permission modes or restart/reopen the session.
- Allow/deny policy rules that bypass the classifier for some operations.

## Remaining limitations
Tool timers may begin too early and fold classifier delay into tool latency. A fixed timeout can fail to fire or be applied to only part of the path. Blind retries amplify classifier load and session delay. Restarting can destroy warm context/cache state. Disabling safety classification for speed is not an acceptable optimization. Generic stall watchdogs detect silence but do not identify the authorization layer or provide a secure fallback.

## Root-cause analysis
1. Authorization is modeled as incidental tool overhead rather than a first-class span.
2. Pre-dispatch classifier, policy, UI, and dispatch transitions are not consistently timestamped.
3. Error taxonomy conflates provider unavailability, malformed classifier requests, denial, and transport/channel failure.
4. Retry ownership is unclear across classifier client, permission layer, and outer agent loop.
5. Safe fallback behavior is undefined: teams either wait indefinitely, retry repeatedly, or disable controls.

## Improvement opportunity
Instrument the permission path as a distinct critical-path state machine. Enforce latency budgets, classify failures precisely, stop repeated identical retries, and fall back to explicit manual approval or task suspension—not unsafe auto-execution—when classification is unavailable or exceeds budget.

## Proposed solution
This package supplies a trace analyzer, enforceable latency/SLO rules, a baseline skill, a performance investigator, a measure-diagnose-optimize workflow, and a pre-dispatch hook contract. The analyzer consumes JSONL permission events and reports classifier wait, dispatch gap, tool execution time, timeout violations, and repeated identical failure loops.

## Goal
Reduce authorization-path latency and retry waste while preserving or strengthening permission boundaries.

## Metrics
- classifier p50/p95/p99 latency;
- authorization share of end-to-end tool latency;
- dispatch gap after classifier completion;
- classifier timeout/SLO violation rate;
- identical classifier retry count;
- manual-fallback rate;
- actual tool execution p95;
- session time lost to permission waits;
- task success rate with security controls unchanged.

## Trigger
Performance investigation of slow tool calls, auto-mode stalls, classifier failures, or before/after rollout of permission-path changes.

## Inputs
JSONL trace with timestamps and event types for `tool_proposed`, `classifier_start`, `classifier_end`, `approval_start/end` when applicable, `tool_dispatch`, and `tool_result`.

## Outputs
Latency decomposition, violations, retry-loop evidence, and a bounded remediation decision.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86339
- https://github.com/anthropics/claude-code/issues/83773
- https://github.com/anthropics/claude-code/issues/85411
- https://github.com/anthropics/claude-code/issues/81425
- https://github.com/anthropics/claude-code/issues/84673
- https://github.com/anthropics/claude-code/issues/85491

## Verification standard
Implemented means instrumentation and guard rules exist. Measured means baseline and post-change traces are analyzed. Verified means classifier-path latency or retry waste improves without bypassing permission controls, while security behavior remains fail-safe.