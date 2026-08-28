# Quantum Error Correction

## Purpose
Analyze and prototype quantum error-correcting schemes with explicit logical-error targets, code distance, syndrome behavior, and physical-resource overhead.

## When to use
Use for fault-tolerant architecture planning, code experiments, or logical-qubit resource studies; not as a substitute for near-term error mitigation.

## Inputs
Physical error model, logical error target, candidate code, decoder, operation set, hardware constraints.

## Context to inspect
Threshold assumptions, correlated errors, measurement cadence, leakage, decoder latency, lattice/connectivity, and logical-gate requirements.

## Core knowledge
Fault tolerance depends on complete syndrome extraction, decoding, logical operations, and physical error assumptions—not code distance alone.

## Procedure
1. Define physical and logical error metrics.
2. Choose a code compatible with hardware and operation needs.
3. Model syndrome extraction and measurement faults.
4. Select and benchmark a decoder.
5. Simulate logical error rate across physical error regimes.
6. Estimate distance and physical-qubit overhead for target reliability.
7. Include magic-state or non-Clifford overhead where relevant.
8. Test correlated-error sensitivity and decoder latency.
9. Document assumptions separately from measured evidence.

## Decision points
Prefer codes aligned with native connectivity and measurement capabilities. Increase distance only when below-threshold behavior is demonstrated.

## Common failure patterns
Threshold claims from unrealistic IID noise, excluding measurement errors, ignoring logical-gate overhead, and quoting logical qubits without physical resources.

## Verification
Reproduce logical-error scaling under documented models and validate decoder correctness on injected faults.

## Expected output
A fault-tolerance resource and reliability analysis.

## Stop conditions
Stop when the physical model is unknown, error rates are above usable thresholds, or required overhead exceeds the architecture envelope.