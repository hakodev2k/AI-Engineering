# Agent Execution Reliability

## Purpose
Make multi-step AI agents predictable enough to operate safely under retries, partial failures, tool errors, and state transitions.

## When to use
Use for autonomous or semi-autonomous workflows that plan, call tools, persist state, or perform side effects.

## Inputs
Agent graph, tool contracts, state model, step limits, retry policy, approval gates, audit logs, failure history.

## Preconditions
Tool authorization and side-effect semantics are documented outside model prompts.

## Context to inspect
Planner/executor loop, orchestration framework, tool schemas, state persistence, queueing, idempotency keys, human approval, cancellation paths.

## Core knowledge
Agent reliability depends on deterministic guardrails around probabilistic reasoning. Step execution, authorization, retries, state transitions, and external actions must be bounded independently of model intent.

## Procedure
1. Map agent states, transitions, and external side effects.
2. Define maximum steps, wall-clock deadline, and token/cost bounds.
3. Make tool authorization deterministic.
4. Add idempotency protection for repeatable external actions.
5. Persist checkpoints at safe boundaries.
6. Handle partial tool success explicitly.
7. Propagate cancellation and prevent abandoned workers from continuing.
8. Define human-approval points for irreversible actions.
9. Add replayable traces for failed runs.
10. Test tool outage, timeout, duplicate delivery, model error, and restart scenarios.

## Decision points
Prefer resumable checkpoints for long workflows; restart from scratch only when repeated side effects are impossible. Require human confirmation when rollback is not feasible and impact is material.

## Common failure patterns
Prompt-only authorization, unbounded loops, duplicate tool execution, stale state after retry, hidden partial success, and inability to cancel queued actions.

## Verification
Failure-injection tests demonstrate bounded execution, correct resume behavior, no duplicate irreversible actions, and complete auditability.

## Expected output
An agent reliability design covering state, limits, retries, idempotency, approvals, cancellation, and recovery.

## Stop conditions
Escalate when external action semantics, authorization ownership, or rollback behavior cannot be determined.