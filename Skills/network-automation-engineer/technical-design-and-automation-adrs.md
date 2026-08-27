# Technical Design and Automation ADRs

## Purpose
Make senior network-automation decisions explicit, reviewable, and durable through concise technical designs and architecture decision records.

## When to use
Use for new automation platforms, protocol choices, source-of-truth changes, closed-loop systems, major abstractions, and migration strategies.

## Inputs
Requirements, constraints, alternatives, existing architecture, risk, operational ownership, cost, and migration needs.

## Context to inspect
Current workflows, incident history, platform capabilities, team skills, security/compliance, and lifecycle roadmap.

## Core knowledge
Architecture decisions should state context, alternatives, consequences, and reversal cost. Automation quality includes operability and organizational ownership, not only technical elegance.

## Procedure
1. Define problem and measurable outcomes.
2. Separate hard constraints from preferences.
3. Identify realistic alternatives including no change.
4. Compare safety, portability, complexity, scalability, security, cost, and operations.
5. Prototype uncertain high-risk assumptions.
6. Choose and document rationale.
7. Record consequences and rejected alternatives.
8. Define migration, rollback, ownership, and success metrics.
9. Obtain review from network, platform, security, and operations stakeholders as relevant.
10. Revisit when assumptions materially change.

## Decision points
Prefer simpler systems when they satisfy requirements; introduce abstractions only when repeated variation justifies them. Optimize for reversible decisions when uncertainty is high.

## Common failure patterns
Tool-first decisions, no operational owner, vague portability claims, ignoring migration cost, and ADRs written after implementation to justify a foregone conclusion.

## Verification
Check that implementation and rollout criteria trace to the decision and that key assumptions have evidence.

## Expected output
Concise design/ADR with alternatives, trade-offs, risks, migration, ownership, and verification plan.

## Stop conditions
Stop when critical requirements, ownership, security constraints, or failure semantics remain unresolved.