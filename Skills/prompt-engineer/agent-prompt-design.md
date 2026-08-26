# Agent Prompt Design

## Purpose
Define reliable operating instructions for multi-step agents that must plan, use tools, manage state, and terminate correctly.

## When to use
Use for autonomous or semi-autonomous workflows with multiple decisions rather than a single model response.

## Inputs
Agent objective, tools, state model, permissions, budgets, completion criteria, and escalation policy.

## Context to inspect
Inspect orchestration loop, tool contracts, memory, checkpoints, max steps, retry policy, and side effects.

## Core knowledge
Agent reliability depends on bounded autonomy, observable state, explicit completion criteria, and runtime guardrails. More planning prose does not compensate for weak orchestration.

## Procedure
1. Define the agent's objective and non-goals.
2. Specify authoritative sources and tool-use expectations.
3. Define state that must persist between steps.
4. Set completion and failure criteria.
5. Establish action budgets and loop limits.
6. Separate reversible exploration from consequential actions.
7. Define how the agent handles missing information and contradictions.
8. Require evidence before claiming completion.
9. Test tool failures, cyclic plans, stale state, and partial completion.
10. Instrument step count, tool errors, cost, and terminal reasons.

## Decision points
Use deterministic workflow graphs for predictable processes and open planning only where task variation warrants it. Add human approval where consequence or ambiguity is high.

## Common failure patterns
No stop rule; planning forever; claiming completion without checking writes; storing stale assumptions as memory; granting broad tools unnecessarily; retry storms.

## Verification
Scenario tests reach correct terminal states within budgets, partial failures do not masquerade as success, and traces explain why actions occurred.

## Expected output
Agent operating contract, termination rules, tool policy, state assumptions, and scenario tests.

## Stop conditions
Stop if consequential actions lack authorization, state semantics are undefined, or the runtime cannot enforce step/tool budgets.