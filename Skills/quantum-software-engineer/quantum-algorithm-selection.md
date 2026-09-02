# Quantum Algorithm Selection

## Purpose
Evaluate whether a problem has a credible quantum formulation and select an algorithmic family based on structure, resource requirements, and expected advantage rather than novelty.

## When to use
Use during technical discovery, architecture planning, proof-of-concept design, or when comparing classical and quantum approaches.

## Inputs
Business or scientific objective, input size, data-access model, accuracy requirements, classical baseline, hardware limits, and acceptable runtime/cost.

## Preconditions
A measurable success criterion and representative workload must exist.

## Context to inspect
Current classical solution, bottlenecks, data encoding costs, algorithm assumptions, fault-tolerance requirements, and available quantum resources.

## Core knowledge
Quantum speedups are conditional on problem structure and input models. State preparation, oracle construction, readout, sampling, and error-correction overhead can dominate theoretical gains. Distinguish asymptotic complexity from end-to-end utility.

## Procedure
1. Define the computational problem precisely.
2. Establish a competitive classical baseline.
3. Identify exploitable structure such as periodicity, search space, linear algebra, sampling, optimization, or simulation.
4. Map candidate quantum algorithms to required assumptions.
5. Include state-preparation and measurement costs.
6. Estimate logical qubits, depth, shots, and classical coordination.
7. Determine whether NISQ execution, simulation, or fault-tolerant hardware is required.
8. Compare end-to-end complexity and operational cost.
9. Build a minimal experiment for the most credible candidate.
10. Define explicit criteria for abandoning the quantum approach.

## Decision points
Choose hybrid variational methods only when optimization landscape and noise tolerance justify them. Prefer classical methods when quantum overhead erases the expected benefit.

## Common failure patterns
Claiming advantage from kernel complexity alone, ignoring data loading, using tiny toy instances as evidence of scale advantage, and selecting algorithms based on popularity rather than problem structure.

## Verification
Reproduce the classical baseline, validate resource estimates, test small instances, and state exactly which assumptions are required for any claimed advantage.

## Expected output
An evidence-based algorithm recommendation, rejected alternatives, resource estimate, and experiment plan.

## Stop conditions
Stop when no credible advantage hypothesis exists, required assumptions cannot be satisfied, or resource needs exceed foreseeable execution capability.