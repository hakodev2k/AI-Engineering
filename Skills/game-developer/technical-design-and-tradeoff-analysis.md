# Technical Design and Tradeoff Analysis

## Purpose
Turn gameplay and production requirements into implementable technical designs that make constraints, alternatives, risks, migration, and verification explicit.

## When to use
Use before major gameplay systems, engine integrations, multiplayer features, persistence changes, performance-sensitive work, or risky refactors.

## Inputs
Requirements, player experience goals, existing architecture, target platforms, team/content workflow, schedule, performance budgets, and operational constraints.

## Context to inspect
Inspect current code and content boundaries, dependencies, technical debt, production telemetry, platform limitations, testability, migration needs, and prior architectural decisions.

## Core knowledge
Senior design is constraint management. Prefer the simplest architecture that satisfies current evidence while preserving important change paths. Explicitly compare implementation complexity, runtime cost, authoring cost, failure modes, observability, and reversibility.

## Procedure
1. Restate functional and non-functional goals.
2. Separate hard constraints from preferences.
3. Inspect existing patterns before proposing new ones.
4. Identify at least two viable approaches for material decisions.
5. Compare performance, complexity, content workflow, testing, operations, and migration.
6. Choose an approach and document why alternatives were rejected.
7. Define interfaces, ownership, state, and failure behavior.
8. Define rollout/migration and rollback where applicable.
9. Define measurable verification criteria.
10. Review assumptions with affected disciplines before implementation.

## Decision points
Prefer reversible decisions when uncertainty is high. Accept specialized complexity only when measured constraints justify it. Avoid architecture changes whose migration cost exceeds expected value.

## Common failure patterns
Designing from patterns rather than requirements, ignoring artist/designer workflows, no performance budget, no failure behavior, undocumented assumptions, and proposals that cannot be incrementally delivered.

## Verification
Review design against requirements, prototype high-risk assumptions, benchmark critical paths, validate migration, and ensure acceptance criteria are measurable.

## Expected output
A concise technical design with explicit decisions, trade-offs, risks, interfaces, and verification plan.

## Stop conditions
Stop when critical requirements conflict, key constraints are unknown, or irreversible decisions require stakeholder approval.