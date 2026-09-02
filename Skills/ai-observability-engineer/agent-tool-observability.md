# Agent and Tool Observability

## Purpose
Make multi-step AI agents diagnosable by exposing planning, tool execution, state transitions, retries, and termination behavior.

## When to use
Use for tool-using agents, workflow agents, autonomous loops, or production incidents involving unexpected actions.

## Inputs
Agent graph, tool schemas, state model, policies, traces, tool results, and execution limits.

## Context to inspect
Inspect planner/router decisions, tool permissions, state persistence, loop limits, human approvals, retries, timeouts, and side-effecting operations.

## Core knowledge
Agent telemetry must reconstruct control flow without relying on hidden model reasoning. Observe explicit decisions, tool calls, outcomes, state transitions, policy checks, and termination reasons. Never require or store private chain-of-thought.

## Procedure
1. Model each externally meaningful agent step as a span or event.
2. Record step type, tool name, sanitized arguments metadata, duration, outcome, and retry number.
3. Record explicit routing decisions and termination reason without hidden reasoning text.
4. Correlate tool-side effects with idempotency or transaction identifiers.
5. Track steps per run, loop rate, tool failure rate, approval latency, and abandoned runs.
6. Flag repeated identical actions and budget exhaustion.
7. Build a run timeline view for incident responders.
8. Test normal, failed-tool, denied-action, timeout, and loop-limit paths.

## Decision points
Capture full tool payloads only under approved secure debugging. Prefer structured state diffs or hashes for sensitive state.

## Common failure patterns
Logging chain-of-thought, missing tool retries, no termination reason, inability to distinguish planned from executed actions, and no correlation for side effects.

## Verification
Replay controlled agent runs and confirm the timeline explains every externally observable action and stop condition.

## Expected output
Agent trace taxonomy, run metrics, safe event schemas, and troubleshooting views.

## Stop conditions
Stop if instrumentation would expose secrets, private reasoning, or side-effecting payloads without approved handling.