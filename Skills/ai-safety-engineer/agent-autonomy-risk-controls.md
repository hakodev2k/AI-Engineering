# Agent Autonomy Risk Controls

## Purpose
Bound the risks created when AI agents plan, persist, call tools, and act over multiple steps with limited supervision.

## When to use
Use for autonomous or semi-autonomous agents with memory, loops, delegated tasks, or external side effects.

## Inputs
Agent loop, tool set, permissions, memory design, task horizon, stop rules, budget controls.

## Context to inspect
Planning, recursion, delegation, persistence, credentials, environment access, retries, and user confirmation.

## Core knowledge
Risk rises with capability, privilege, persistence, action horizon, and reduced oversight. Bound autonomy with deterministic budgets and external controls.

## Procedure
1. Enumerate agent capabilities and irreversible actions.
2. Define explicit task scope and completion criteria.
3. Apply time, token, cost, action, and recursion budgets.
4. Restrict tools and credentials to task needs.
5. Require approval for privilege escalation or consequential actions.
6. Isolate execution environments.
7. Validate destinations and artifacts before execution.
8. Detect loops, goal drift, and repeated failures.
9. Provide kill switches and safe termination.
10. Test long-horizon adversarial scenarios.

## Decision points
Increase autonomy only when evidence shows bounded failure impact. Prefer short-lived credentials and ephemeral environments.

## Common failure patterns
Unbounded loops; self-modifying instructions; persistent broad credentials; silent delegation; retrying harmful actions.

## Verification
Demonstrate deterministic termination, budget enforcement, privilege boundaries, and safe handling of manipulated intermediate state.

## Expected output
An autonomy control envelope with budgets, permissions, approvals, isolation, and tests.

## Stop conditions
Stop deployment when the agent can exceed defined scope or cannot be reliably terminated.