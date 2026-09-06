# Architecture Pattern Selection

## Purpose
Select an AI solution architecture based on workload behavior, risk, operability, and constraints rather than copying a fashionable reference pattern.

## When to use
Use when choosing among direct model calls, RAG, agentic workflows, event-driven orchestration, batch inference, streaming, or hybrid designs.

## Inputs
Use cases, NFRs, task complexity, data sources, interaction model, autonomy level, scale, security requirements, and operational maturity.

## Context to inspect
Inspect current application boundaries, existing APIs, message buses, data platforms, network topology, identity model, observability stack, and team capabilities.

## Core knowledge
Patterns optimize different concerns. Direct inference minimizes complexity; RAG injects external knowledge; agents coordinate tools and multi-step work; event-driven designs decouple long-running workflows; deterministic orchestration improves control and debuggability.

## Procedure
1. Classify workload by synchronicity, duration, statefulness, and autonomy.
2. Identify where deterministic logic is sufficient.
3. Identify knowledge retrieval, tool use, or workflow orchestration needs.
4. Define failure isolation boundaries.
5. Compare candidate patterns against latency, reliability, cost, security, and maintainability.
6. Prefer the least complex pattern that satisfies requirements.
7. Define state ownership and transaction boundaries.
8. Specify fallback and degradation paths.
9. Review operational burden with the owning team.
10. Record the rationale and rejected alternatives.

## Decision points
Use synchronous direct calls for short bounded interactions; asynchronous orchestration for long or failure-prone workflows; agents only when dynamic planning adds material value; RAG only when external or fresh knowledge is required.

## Common failure patterns
Agentifying deterministic workflows, adding vector databases without a retrieval problem, hiding orchestration inside prompts, and creating distributed state with no owner.

## Verification
The chosen pattern satisfies critical NFRs and has explicit ownership, failure handling, observability, and rollback behavior.

## Expected output
An architecture pattern decision with diagrams, trade-offs, state boundaries, and rejected alternatives.

## Stop conditions
Stop when critical requirements are unknown, team operating capability cannot support the pattern, or architecture depends on unvalidated model behavior.