# Multi-Agent Coordination

## Purpose
Design collaboration between specialized agents without duplicated work, hidden conflicts, or runaway communication.

## When to use
Use only when responsibilities are genuinely separable and specialization or parallelism improves outcomes.

## Inputs
Roles, shared goal, tools, state, communication model, budgets, authority boundaries.

## Context to inspect
Task graph, data ownership, tool permissions, latency constraints, conflict-resolution needs, and observability.

## Core knowledge
Multi-agent systems add coordination cost and new failure modes. Explicit ownership, contracts, shared-state rules, and termination matter more than agent count.

## Procedure
1. Prove why one agent or workflow is insufficient.
2. Define non-overlapping responsibilities.
3. Specify inputs and outputs for each role.
4. Choose supervisor, handoff, or peer topology.
5. Define shared-state ownership and synchronization.
6. Bound messages, iterations, and budgets.
7. Establish conflict and failure resolution.
8. Restrict tools by role.
9. Trace cross-agent causality.
10. Compare quality, latency, and cost against a single-agent baseline.

## Decision points
Use a supervisor for centralized control; handoffs for sequential specialization; parallel agents for independent evidence gathering.

## Common failure patterns
Agents debating indefinitely, duplicated research, circular delegation, shared mutable state, unclear authority, and inflated token cost.

## Verification
Demonstrate bounded communication, correct ownership, deterministic completion, safe permissions, and measurable improvement over simpler designs.

## Expected output
A coordination topology with role contracts, state rules, budgets, and evaluation evidence.

## Stop conditions
Stop if specialization does not justify coordination complexity.