# RAG Architecture Decision Records

## Purpose
Make consequential RAG design choices explicit, reviewable, and reversible where possible.

## When to use
Use for embedding migrations, vector stores, chunking changes, hybrid retrieval, rerankers, cache policy, model/provider choices, or security architecture.

## Inputs
Decision context, requirements, alternatives, evaluation evidence, cost/performance data, operational constraints.

## Context to inspect
Inspect current architecture, prior decisions, compatibility, migration paths, team capabilities, vendor dependencies, and rollback options.

## Core knowledge
Senior engineering decisions should preserve rationale, not just outcome. RAG components evolve quickly, so assumptions and revisit triggers are especially important.

## Procedure
1. State the decision and problem boundary.
2. Record functional and non-functional drivers.
3. Identify realistic alternatives including doing nothing.
4. Compare quality, security, latency, cost, operability, and lock-in.
5. Cite evaluation or production evidence.
6. Record assumptions and uncertainties.
7. Select an option and explain accepted trade-offs.
8. Define migration, rollback, and compatibility implications.
9. Record consequences and follow-up work.
10. Define conditions that should trigger reconsideration.

## Decision points
Prefer reversible decisions when evidence is weak. Require stronger evidence for migrations that force corpus-wide reprocessing or vendor lock-in.

## Common failure patterns
ADR written after implementation to justify it; alternatives omitted; benchmark claims without workload evidence; no rollback; assumptions presented as facts.

## Verification
Confirm the implemented architecture matches the accepted decision and that cited evidence is reproducible.

## Expected output
A concise decision record enabling future engineers to understand and revisit the trade-off.

## Stop conditions
Stop approval when critical alternatives, security consequences, or migration risks have not been evaluated.