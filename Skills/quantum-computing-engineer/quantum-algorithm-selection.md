# Quantum Algorithm Selection

## Purpose
Select an appropriate quantum or hybrid algorithm based on problem structure, resource requirements, hardware maturity, and baseline performance.

## When to use
Use after problem formulation and before implementation commitment.

## Inputs
Problem class, instance size, target accuracy, baseline metrics, available hardware, time and cost limits.

## Context to inspect
Known classical methods, algorithmic assumptions, state-preparation cost, oracle construction, qubit/depth estimates, and expected sampling burden.

## Core knowledge
A theoretical speedup is useful only if assumptions and end-to-end overhead are realistic. NISQ algorithms trade circuit depth for repeated sampling and classical optimization; fault-tolerant algorithms may require large logical-resource overhead.

## Procedure
1. Classify the mathematical problem precisely.
2. Establish the best practical classical baseline.
3. Identify candidate quantum families and their assumptions.
4. Estimate logical and physical resources.
5. Include encoding, readout, repetitions, and classical-loop cost.
6. Assess sensitivity to noise and parameter scaling.
7. Compare expected value for near-term and fault-tolerant settings.
8. Select an algorithm only with explicit success and abandonment criteria.

## Decision points
Use variational methods when shallow parameterized circuits fit the problem and optimization is tractable. Use amplitude-estimation/search-style methods only when oracle and fault-tolerant assumptions are credible.

## Common failure patterns
Algorithm-by-popularity selection, ignoring input/output cost, comparing against weak classical baselines, and treating asymptotic complexity as deployable advantage.

## Verification
Produce a resource and baseline comparison that can be challenged independently.

## Expected output
A justified algorithm choice, alternatives considered, and measurable go/no-go criteria.

## Stop conditions
Stop when all candidates require unsupported assumptions or fail to beat the baseline under plausible resources.