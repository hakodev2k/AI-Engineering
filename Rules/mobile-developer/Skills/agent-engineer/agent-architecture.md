# Agent Architecture

## Purpose
Design bounded agent systems whose planning, tools, state, and control flow remain understandable and operable.

## When to use
Use when creating or materially changing an autonomous or semi-autonomous workflow.

## Inputs
Business goal, users, tools, model capabilities, data, latency/cost targets, risk constraints.

## Context to inspect
Existing workflows, APIs, permissions, failure modes, observability, deployment environment, and human approval points.

## Core knowledge
An agent is a control loop around models, tools, state, and policies. More autonomy increases flexibility and failure surface. Prefer deterministic software for deterministic work.

## Procedure
1. Define the outcome and measurable success criteria.
2. Separate deterministic steps from reasoning steps.
3. Define agent state and lifecycle.
4. Bound available tools and permissions.
5. Choose single-agent, router, or multi-agent topology.
6. Define termination, timeout, budget, and approval conditions.
7. Specify failure recovery and idempotency.
8. Add traces, metrics, and audit events.
9. Test normal, ambiguous, adversarial, and dependency-failure cases.
10. Roll out gradually and compare against a baseline.

## Decision points
Use a workflow when steps are known; an agent when runtime reasoning materially improves outcomes. Add multiple agents only for genuinely separable responsibilities.

## Common failure patterns
Unbounded loops, excessive autonomy, hidden state, overlapping agents, tool sprawl, no deterministic fallback, and no cost ceiling.

## Verification
Demonstrate task success, bounded runtime/cost, deterministic termination, safe permissions, useful traces, and recovery behavior.

## Expected output
An explicit agent topology, state model, tool boundary, control policy, failure model, and validation evidence.

## Stop conditions
Stop when goals are undefined, required permissions are unsafe, or success cannot be measured.