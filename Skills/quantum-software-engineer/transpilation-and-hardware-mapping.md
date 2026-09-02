# Transpilation and Hardware Mapping

## Purpose
Translate logical circuits into hardware-executable circuits while controlling routing overhead, gate synthesis, depth, and semantic risk.

## When to use
Use before physical execution, when changing backends, or when diagnosing performance degradation introduced by compilation.

## Inputs
Logical circuit, target backend, coupling graph, native gate set, calibration data, optimization level, and resource budget.

## Context to inspect
Transpiler passes, qubit layout, routing strategy, basis gates, dynamic-circuit support, and backend calibration freshness.

## Core knowledge
Hardware topology and native operations determine physical cost. Mapping can introduce SWAPs and increase error exposure. Compiler optimization is heuristic and backend dependent.

## Procedure
1. Preserve a validated logical circuit as reference.
2. Inspect target topology and native gates.
3. Choose an initial layout using interaction structure and calibration quality.
4. Transpile with reproducible settings.
5. Measure depth, two-qubit gates, swaps, and estimated error.
6. Compare alternative layouts and optimization levels.
7. Check logical equivalence after transformation.
8. Inspect whether measurement mapping remains correct.
9. Record compiler version, seed, backend snapshot, and final mapping.
10. Reject mappings that violate resource or fidelity constraints.

## Decision points
Trade compilation time against circuit quality. Favor connectivity when routing dominates; favor calibrated qubits when gate quality varies materially.

## Common failure patterns
Accepting default mapping blindly, comparing circuits before and after transpilation with inconsistent qubit order, overfitting to stale calibration, and optimizing gate count while increasing critical two-qubit depth.

## Verification
Check equivalence on simulation, resource metrics, final qubit-to-classical-bit mapping, and representative execution outcomes.

## Expected output
A reproducible transpiled circuit, mapping rationale, resource report, and backend assumptions.

## Stop conditions
Stop when topology or native-gate constraints make the circuit infeasible or compiler transformations cannot be validated reliably.