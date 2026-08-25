# Research

## Topic
MCP Tasks polling lifecycle conformance and cancellation efficiency

## Category
Performance

## Problem
Clients implementing the current MCP Tasks extension can waste requests/resources or fail to stop promptly when polling semantics, server-directed intervals, cancellation, and terminal states are not enforced as one lifecycle contract.

## Why it matters now
The 2026-07-28 MCP release moved Tasks into an extension and SDKs are actively implementing it. Client conformance coverage is still incomplete while real SDK issue reports already identify polling/cancellation defects.

## Affected users
MCP client/SDK maintainers, agent platform builders, long-running tool users, gateway operators, and teams measuring task latency/request volume.

## Current public evidence
### Observed evidence
1. MCP Conformance issue #374, opened 2026-06-30 and still open during this research, states the client suite has no Tasks-extension scenarios. It explicitly calls out handling `CreateTaskResult`, honoring `pollIntervalMs`, and polling until terminal state. https://github.com/modelcontextprotocol/conformance/issues/374
2. TypeScript SDK issue #2018, opened 2026-05-05, reports `handleAutomaticTaskPolling` ignores `AbortSignal`; cancelled requests can continue polling indefinitely, leaking loops/resources. https://github.com/modelcontextprotocol/typescript-sdk/issues/2018
3. Python SDK issue #3226, opened 2026-07-30, tracks current client-side Tasks support and describes transparent polling of `tasks/get` while honoring `pollIntervalMs`, demonstrating the exact behavior implementers must get right. https://github.com/modelcontextprotocol/python-sdk/issues/3226
4. TypeScript SDK issue #2598, opened 2026-08-01, reports v2 `tasks/get` and `tasks/cancel` handlers being shadowed/unreachable in one server path, showing Tasks lifecycle integration remains actively brittle. https://github.com/modelcontextprotocol/typescript-sdk/issues/2598
5. MCP 2026-07-28 GA notes confirm Tasks moved to `io.modelcontextprotocol/tasks`, use poll-based `tasks/get`, and add `tasks/update`. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-07-28-spec-ga/index.md

## Interpretation
Generic polling optimization is not sufficient. The unresolved engineering problem is a protocol-specific lifecycle invariant across task creation, poll cadence, cancellation, terminal state, and bounded resource usage, with incomplete conformance testing across clients.

## Existing approaches
- SDK automatic polling helpers;
- server-provided `pollIntervalMs`;
- generic AbortSignal/cancellation primitives;
- exponential backoff and deadlines;
- generic wait brokers/status-poll suppression;
- MCP conformance tests for other protocol surfaces.

## Remaining limitations
- Current conformance suite lacks client Tasks scenarios.
- Cancellation may not propagate into the automatic polling loop.
- Poll cadence can diverge from server guidance.
- A generic retry loop can remain alive after terminal/cancel events.
- Implementations vary across SDKs and may route task methods differently.
- Poll optimization without lifecycle checks can trade fewer calls for delayed terminal detection or incorrect cancellation.

## Root-cause analysis
1. Tasks are a relatively new extension with evolving SDK integration.
2. Polling control spans protocol data, timers, cancellation primitives, and terminal-state bookkeeping.
3. Cancellation is often handled by the parent request while the child poll loop owns its own timer/lifecycle.
4. Existing generic polling utilities do not encode MCP-specific `pollIntervalMs` semantics.
5. Missing conformance fixtures allow divergent behavior to survive until production integration.

## Improvement opportunity
Create a provider-neutral, deterministic lifecycle trace auditor and regression workflow specifically for MCP Tasks. It should verify server-directed cadence, cancellation/terminal stop behavior, and explicit poll/wall-clock budgets while producing before/after request/latency metrics.

## Proposed solution
This package supplies the auditor, enforceable rules, performance-analysis skill, independent verifier, bounded Measure→Diagnose→Hypothesize→Optimize→Measure workflow, hook, and unit tests.

## Goal
Reduce avoidable task polling and leaked loops without increasing terminal detection latency beyond accepted SLOs or weakening lifecycle correctness.

## Metrics
Polls/task, requests/task, interval violations, post-cancel polls, post-terminal polls, cancellation-to-stop latency, completion-detection latency, elapsed polling lifetime.

## Trigger
MCP Tasks client implementation/change, cancellation bug, excess polling telemetry, or conformance regression.

## Inputs
Canonical JSONL lifecycle trace plus configurable poll/elapsed budgets.

## Outputs
Deterministic pass/fail report and measurable lifecycle metrics.

## Relevant sources
- https://github.com/modelcontextprotocol/conformance/issues/374
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2018
- https://github.com/modelcontextprotocol/python-sdk/issues/3226
- https://github.com/modelcontextprotocol/typescript-sdk/issues/2598
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-07-28-spec-ga/index.md
