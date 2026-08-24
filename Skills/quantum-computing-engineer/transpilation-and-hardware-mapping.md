# Transpilation and Hardware Mapping

## Purpose
Map validated logical circuits onto specific quantum hardware while minimizing routing, depth, and noise exposure without changing semantics.

## When to use
Use before hardware execution, backend comparison, or when transpilation dominates circuit quality.

## Inputs
Logical circuit, target backend, native gates, coupling map, calibration data, optimization level, and correctness tests.

## Preconditions
The logical circuit passes simulator/reference tests.

## Context to inspect
Connectivity, native gate fidelities, qubit calibration, directionality, reset support, dynamic-circuit capabilities, and compiler passes.

## Core knowledge
Routing introduces SWAPs and additional two-qubit gates. The best logical circuit may not be the best physical circuit. Mapping should consider current calibration and workload structure.

## Procedure
1. Snapshot backend topology and calibration.
2. Transpile with a reproducible seed/configuration.
3. Record depth, two-qubit count, SWAPs, and chosen layout.
4. Test multiple initial layouts when material.
5. Compare compiler optimization settings.
6. Inspect whether decompositions preserve expected structure.
7. Prefer mappings avoiding unstable qubits when possible.
8. Execute representative circuits and compare output quality.
9. Keep logical and transpiled artifacts separately versioned.
10. Re-evaluate mappings after material calibration changes.

## Decision points
Use calibration-aware mapping when backend drift is material; prefer stable deterministic compilation for reproducibility when quality differences are negligible.

## Common failure patterns
Assuming transpilation is semantics-neutral without tests, using stale calibration, optimizing only logical gate count, and failing to store the physical circuit.

## Verification
Compare logical and physical simulations where feasible and confirm hardware results improve or remain stable under the selected mapping.

## Expected output
Transpiled circuit, mapping rationale, compiler settings, resource metrics, calibration snapshot, and validation evidence.

## Stop conditions
Stop when routing makes the circuit infeasible or compiler transformations cannot be validated.