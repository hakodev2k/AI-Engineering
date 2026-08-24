# Quantum Resource Estimation

## Purpose
Estimate logical and physical resources required to execute a quantum workload at a target accuracy and reliability.

## When to use
Use for feasibility analysis, hardware-roadmap planning, algorithm comparison, and fault-tolerant architecture decisions.

## Inputs
Algorithm, problem size, precision target, logical circuit, code assumptions, physical error rates, and hardware architecture.

## Preconditions
Algorithmic assumptions and target outputs are explicit.

## Context to inspect
Logical qubits, T-count/non-Clifford cost, circuit depth, measurements, ancillas, code distance, routing, magic-state factories, decoder throughput, and runtime.

## Core knowledge
Logical gate counts alone are insufficient. Fault-tolerant cost is frequently dominated by error-correction cycles, non-Clifford resources, routing, and target logical failure probability.

## Procedure
1. Define problem size and precision requirements.
2. Count logical qubits and major logical operations.
3. Separate Clifford and non-Clifford resources.
4. Estimate depth and parallelism.
5. Set a total logical failure budget.
6. Select physical error and code assumptions.
7. Estimate code distance and physical qubits.
8. Include distillation/routing/decoder overhead.
9. Convert cycles to runtime using hardware timing assumptions.
10. Run sensitivity analysis across key uncertain parameters.
11. Compare candidate algorithms under consistent assumptions.

## Decision points
Use coarse estimates for early screening and detailed architectural models only after a candidate survives. Prefer ranges over false precision when hardware assumptions are uncertain.

## Common failure patterns
Reporting logical qubits as physical qubits, omitting T-state cost, hiding precision dependence, and mixing assumptions from incompatible hardware models.

## Verification
Cross-check with independent estimators or hand calculations on small cases and ensure scaling trends are consistent.

## Expected output
Resource table, assumptions, sensitivity ranges, dominant costs, and feasibility conclusion.

## Stop conditions
Stop when critical algorithm or hardware parameters are unknown enough to make the estimate non-actionable.