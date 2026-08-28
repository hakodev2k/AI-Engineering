# Hardware Backend Selection

## Purpose
Choose quantum hardware based on algorithm requirements, topology, native operations, fidelity, queue behavior, and cost rather than headline qubit count.

## When to use
Use before hardware execution, procurement, or provider comparison.

## Inputs
Circuit/resource profile, required qubits, connectivity, precision target, shot volume, latency and budget constraints.

## Context to inspect
Native gates, coupling map, coherence, two-qubit fidelity, readout quality, dynamic-circuit support, queue times, calibration freshness, pricing, and region/compliance needs.

## Core knowledge
Usable computational volume is constrained by error, connectivity, and workflow overhead. Backend choice should be circuit-specific.

## Procedure
1. Extract qubit count, topology, and gate requirements from the workload.
2. Filter incompatible devices.
3. Compare current calibration and historical stability.
4. Transpile representative circuits for each candidate.
5. Estimate depth, swap overhead, expected error, shots, and cost.
6. Run a small benchmark set where possible.
7. Include queue and orchestration latency.
8. Select primary and fallback backends with documented rationale.

## Decision points
Prefer fewer higher-quality qubits when routing is manageable. Prefer simulator/emulator execution when hardware adds no decision-relevant evidence.

## Common failure patterns
Selecting by raw qubit count, using stale calibration, ignoring queue time, and comparing providers with different transpilation settings.

## Verification
Confirm representative circuits execute and benchmark metrics meet predefined thresholds.

## Expected output
A backend decision with measured/estimated quality, cost, and fallback plan.

## Stop conditions
Stop when no backend satisfies resource or compliance requirements.