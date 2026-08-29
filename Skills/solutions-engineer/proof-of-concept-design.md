# Proof of Concept Design

## Purpose
Design a bounded technical proof that resolves the highest-value uncertainties without becoming an uncontrolled implementation project.

## When to use
Use when important feasibility, integration, performance, or operational claims require empirical validation.

## Inputs
Decision criteria, risks, representative workload, environment constraints, timeline, stakeholders.

## Context to inspect
Unknowns, existing evidence, product limits, dependencies, test data, available environments, and decision deadline.

## Core knowledge
A POC is an experiment, not a miniature production rollout. Its scope should maximize decision information per unit of effort.

## Procedure
1. State the decision the POC must enable.
2. Rank uncertainties by decision impact.
3. Define measurable success and failure criteria.
4. Select representative scenarios and data.
5. Establish baseline and test environment.
6. Define scope exclusions explicitly.
7. Execute repeatable tests and preserve evidence.
8. Summarize results, caveats, and production gaps.

## Decision points
Use a POC only when documentation or existing evidence cannot resolve material uncertainty. Prefer narrow experiments over broad demos.

## Common failure patterns
Moving goalposts, testing toy workloads, adding unrelated features, hiding failed criteria, and treating POC code as production-ready.

## Verification
Results are reproducible, criteria were defined before execution, and evidence directly informs the target decision.

## Expected output
A bounded POC plan and evidence-based conclusion.

## Stop conditions
Stop when criteria cannot be measured, representative data is unavailable, or scope expands beyond the decision need.