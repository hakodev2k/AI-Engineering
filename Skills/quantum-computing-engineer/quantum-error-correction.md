# Quantum Error Correction

## Purpose
Evaluate and design fault-tolerant error-correction strategies with explicit logical-qubit, code-distance, syndrome, and physical-resource assumptions.

## When to use
Use for fault-tolerant architecture, long-term resource planning, or code-level experiments. Do not use when near-term mitigation is the actual requirement.

## Inputs
Target logical circuit, physical error rates, connectivity, logical error target, code family candidates, and hardware constraints.

## Preconditions
Physical error assumptions and logical reliability targets are defined.

## Context to inspect
Threshold assumptions, code distance, syndrome cycle time, decoder performance, leakage, correlated errors, magic-state requirements, and routing overhead.

## Core knowledge
Fault tolerance replaces one physical qubit with many physical qubits plus continuous syndrome extraction and decoding. Resource cost depends strongly on physical error rate, target logical error rate, non-Clifford operations, and architecture.

## Procedure
1. Define logical error budget for the workload.
2. Characterize physical gate, measurement, and idle error assumptions.
3. Compare suitable code families and architectural constraints.
4. Estimate code distance and physical qubits per logical qubit.
5. Account for syndrome extraction and decoder latency.
6. Estimate logical gate and routing overhead.
7. Include magic-state or equivalent non-Clifford resources.
8. Model correlated faults and leakage handling.
9. Run code-level simulations where feasible.
10. Produce sensitivity analysis across physical error rates.

## Decision points
Choose code families based on connectivity, measurement capability, decoder feasibility, and total system overhead—not code distance alone.

## Common failure patterns
Ignoring non-Clifford cost, using threshold as expected operating error, omitting decoder latency, and presenting logical-qubit counts without physical assumptions.

## Verification
Reproduce code-capacity/circuit-level simulations or trusted estimates and show the logical error target is met under stated assumptions.

## Expected output
Code choice, resource model, logical-error estimate, sensitivity analysis, decoder assumptions, and major risks.

## Stop conditions
Stop when physical error assumptions are unsupported or resource requirements exceed plausible hardware by orders of magnitude without a credible roadmap.