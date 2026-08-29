# Agentic Workflow Design

## Purpose
Design AI agent workflows that use tools, state, planning, and human checkpoints to complete multi-step tasks reliably.

## When to use
Use when a product must coordinate several actions or systems rather than only generate a response.

## Inputs
User goal, available tools, permissions, state model, business rules, risk levels, failure modes, latency and cost constraints.

## Context to inspect
Tool contracts, authentication, side effects, idempotency, audit logs, retries, approvals, escalation paths, and model/tool evals.

## Core knowledge
Agent reliability is limited by compounding errors. High-impact actions need constrained tools, explicit authorization, bounded retries, observable state, and reversible or approval-gated execution.

## Procedure
1. Map the end-to-end job and required actions.
2. Separate read-only reasoning from side-effecting operations.
3. Define tool inputs, outputs, errors, and permission boundaries.
4. Identify which steps can be deterministic.
5. Define state, checkpoints, retry limits, and timeout behavior.
6. Add human approval for irreversible or high-risk actions.
7. Specify recovery and partial-completion behavior.
8. Evaluate complete task success, not individual turns only.
9. Instrument every tool call and state transition.

## Decision points
Prefer deterministic workflows when steps are known and stable. Use agentic planning where task decomposition genuinely varies and the additional flexibility justifies lower predictability.

## Common failure patterns
Unlimited loops, excessive autonomy, hidden side effects, weak tool schemas, missing idempotency, and measuring conversational quality instead of task completion.

## Verification
Run scenario-based tests for success, tool failure, permission denial, duplicate requests, partial state, and approval rejection.

## Expected output
An agent workflow specification with tools, controls, state, human checkpoints, metrics, and recovery paths.

## Stop conditions
Stop when required actions cannot be permissioned safely, audited, or reversed/approved where necessary.