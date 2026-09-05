# Graph Reasoning and Inference

## Purpose
Apply rule-based or semantic inference to derive useful graph facts while keeping reasoning explainable, bounded, testable, and operationally safe.

## When to use
Use for taxonomy closure, transitive relationships, policy rules, inferred classifications, relationship completion, or rule-driven enrichment.

## Inputs
Ontology, rule set, expected inferred facts, graph size, consistency requirements, latency/freshness targets.

## Preconditions
Separate facts asserted by sources from facts inferred by rules.

## Context to inspect
Reasoner, rule engine, materialization strategy, dependency cycles, provenance, invalidation behavior, query workload.

## Core knowledge
Inference may be forward-chained/materialized or computed at query time. Materialization improves reads but complicates invalidation; query-time inference preserves freshness but can increase latency. Cycles and broad transitivity can cause combinatorial growth.

## Procedure
1. Define each rule's semantic intent.
2. Identify source predicates and inferred predicates.
3. Test rules on minimal positive and negative examples.
4. Detect cycles and explosive closure patterns.
5. Choose materialized versus query-time execution.
6. Attach rule/version provenance to derived facts.
7. Define invalidation when source facts change.
8. Benchmark reasoning on realistic graph sizes.
9. Add consistency and contradiction checks.
10. Monitor inferred-fact volume and latency.

## Decision points
Materialize stable, frequently queried inferences; compute volatile or rarely used inferences at query time. Use formal ontology reasoning when semantics justify it; use explicit business rules for operational policy.

## Common failure patterns
Mixing asserted and inferred facts, infinite or explosive rule chains, stale materialization, opaque rules, and applying transitivity to relations where it is not semantically valid.

## Verification
Compare expected closure against fixtures, remove source facts to verify invalidation, inspect explanations, and benchmark worst-case rule paths.

## Expected output
A documented inference model, rule set, provenance scheme, invalidation strategy, tests, and performance evidence.

## Stop conditions
Escalate when inferred facts affect authorization, compliance, or high-risk decisions without an explainable and approved rule basis.