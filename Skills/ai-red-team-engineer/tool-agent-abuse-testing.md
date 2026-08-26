# Tool and Agent Abuse Testing

## Purpose
Test whether an AI agent can be induced to misuse tools, exceed authority, chain benign capabilities into harmful outcomes, or act without required confirmation.

## When to use
Use for agents with file, browser, code, messaging, financial, infrastructure, database, or other action-capable tools.

## Inputs
Tool schemas, permission model, agent loop, approval rules, sandbox configuration, audit logs, and business constraints.

## Context to inspect
Map each tool's side effects, credential scope, reachable resources, argument validation, confirmation gates, recursion limits, and cross-tool compositions.

## Core knowledge
Agent risk is determined by capability composition and authority, not model text alone. Least privilege, deterministic authorization, constrained execution, idempotency, and human approval reduce blast radius.

## Procedure
1. Inventory tools and classify read/write/destructive capabilities.
2. Identify privilege boundaries and sensitive targets.
3. Test unauthorized direct tool requests.
4. Test indirect requests delivered through retrieved or external content.
5. Test chained actions that bypass per-tool assumptions.
6. Test argument manipulation, path/resource substitution, replay, and duplicate execution.
7. Test confirmation and cancellation semantics.
8. Measure auditability and containment after a simulated compromise.
9. Recommend controls and add regression cases.

## Decision points
Remove unnecessary tools before adding detection. Prefer narrow scoped credentials and server-side policy checks over model judgment for authorization.

## Common failure patterns
Broad service credentials; approval based only on model-generated summaries; hidden side effects; no transaction boundaries; trusting tool descriptions; unlimited loops or retries.

## Verification
Demonstrate that unauthorized actions are denied at execution time, sensitive operations require intended approval, duplicate calls are safe where required, and logs reconstruct the action chain.

## Expected output
An abuse-case matrix with reproducible evidence, affected tools, blast radius, and prioritized controls.

## Stop conditions
Do not execute destructive or external side effects outside an explicitly isolated test environment; escalate if safe simulation is unavailable.