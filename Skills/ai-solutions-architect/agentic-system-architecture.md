# Agentic System Architecture

## Purpose
Design bounded agentic systems that can plan, call approved tools, and complete multi-step work while remaining observable and recoverable.

## When to use
Use when task paths cannot be fully predetermined and dynamic tool selection adds measurable value. Avoid agents for simple deterministic workflows.

## Inputs
Goals, approved tool catalog, action boundaries, state model, autonomy level, risk classification, latency budget, and human-review rules.

## Context to inspect
Review tool interfaces, business side effects, authorization model, workflow rules, existing orchestrators, audit needs, and failure scenarios.

## Core knowledge
Agentic architecture separates reasoning from execution authority. Tool calls need structured contracts, validation, timeouts, idempotency, and explicit side-effect boundaries. State and termination rules should be enforced by the surrounding system.

## Procedure
1. Define the agent objective and non-goals.
2. Enumerate approved tools and classify their side effects.
3. Define which actions require user or operator confirmation.
4. Define state, memory, checkpoints, and maximum execution limits.
5. Validate tool inputs and outputs outside the model.
6. Define retry, timeout, rollback, and safe-termination behavior.
7. Instrument plans, tool calls, outcomes, cost, and latency.
8. Evaluate success, looping, ambiguous instructions, and partial failures.
9. Start with constrained autonomy.
10. Expand capabilities only after measured evidence supports it.

## Decision points
Use deterministic orchestration when the path is known. Use an agent when dynamic sequencing improves outcomes. Keep consequential actions behind explicit confirmation where appropriate.

## Common failure patterns
Unbounded loops, overly broad tool access, missing idempotency, hidden state, weak termination rules, and treating prompt instructions as the only control layer.

## Verification
Demonstrate bounded execution, correct tool routing, traceable runs, safe failure handling, and acceptance-test coverage.

## Expected output
An agent architecture with tool boundaries, state model, controls, failure behavior, evaluations, and operating limits.

## Stop conditions
Stop when required actions cannot be safely bounded, the workflow cannot be observed end to end, or failure recovery is undefined.