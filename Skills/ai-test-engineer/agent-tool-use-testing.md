# Agent Tool-Use Testing

## Purpose
Validate AI agents that plan, call tools, maintain state, and act on external systems. The focus is correct tool selection, argument construction, sequencing, permissions, recovery, and bounded autonomy.

## When to use
Use for agents with function calling, browser actions, code execution, APIs, workflows, or other side effects.

## Inputs
Agent instructions, tool schemas, permission model, task suite, state model, expected outcomes, safety constraints, and failure simulations.

## Preconditions
Tool contracts and allowed action boundaries are documented.

## Context to inspect
Inspect system prompts, planner/executor logic, tool definitions, authorization, retries, memory, confirmation gates, idempotency controls, and audit logs.

## Core knowledge
Agent correctness is trajectory-level, not only final-answer quality. A correct outcome reached through unsafe or unauthorized actions is still a failure. Tests must observe decisions, tool calls, state changes, and external side effects.

## Procedure
1. Define representative tasks and prohibited actions.
2. Specify acceptable tool-call trajectories and hard invariants.
3. Test tool selection and schema-valid arguments.
4. Test missing, malformed, stale, and contradictory tool results.
5. Simulate timeouts, partial failures, and permission denials.
6. Test repeated actions for idempotency and duplicate prevention.
7. Test state transitions across multi-step tasks.
8. Probe whether untrusted tool content can redirect the agent.
9. Verify confirmation requirements before irreversible actions.
10. Evaluate recovery, abort, and escalation behavior.
11. Inspect auditability of each action.

## Decision points
Allow autonomous retries only for safe, idempotent operations. Require human confirmation for destructive, financial, permission-changing, or otherwise high-impact actions.

## Common failure patterns
Judging only the final result, hidden unauthorized calls, retry storms, duplicate side effects, accepting tool output as trusted instructions, and losing task state after partial failure.

## Verification
Confirm final outcomes, tool-call traces, permissions, state transitions, and side effects against expected behavior.

## Expected output
An agent test report with trajectory failures, tool-contract issues, safety violations, and release gates.

## Stop conditions
Stop when tool permissions are unknown, destructive actions cannot be sandboxed, or audit logs are insufficient to reconstruct behavior.