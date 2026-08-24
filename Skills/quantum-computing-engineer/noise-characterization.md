# Noise Characterization

## Purpose
Characterize hardware noise sufficiently to explain result quality, compare backends, and guide circuit/runtime choices.

## When to use
Use before hardware experiments, after calibration changes, or when observed distributions drift. Do not infer hardware noise from one circuit or one run.

## Inputs
Backend calibration data, test circuits, shot budget, timestamps, qubit mapping, and expected ideal results.

## Preconditions
A simulator or analytically known reference is available.

## Context to inspect
Readout error, gate error, T1/T2, crosstalk indicators, calibration age, qubit connectivity, queue delay, and run metadata.

## Core knowledge
Noise is time-varying and context-dependent. Aggregate error rates do not capture coherent errors, crosstalk, correlated faults, or routing effects. Characterization should be tied to the actual circuit family and execution window.

## Procedure
1. Record calibration snapshot and backend identity.
2. Select representative qubits and gates.
3. Run simple reference circuits with known outcomes.
4. Separate readout from gate-induced error where possible.
5. Compare alternative mappings.
6. Repeat across time to estimate drift.
7. Correlate error with depth and two-qubit operations.
8. Flag outliers and unstable qubits.
9. Build a noise summary relevant to the target workload.
10. Re-run after material calibration changes.

## Decision points
Prefer workload-specific characterization over exhaustive tomography when engineering decisions only require relative quality. Use deeper characterization when unexplained correlated errors dominate.

## Common failure patterns
Using stale calibration data, averaging away unstable qubits, ignoring measurement error, and comparing runs from different calibration windows as if identical.

## Verification
Repeat tests, quantify uncertainty, and confirm identified noisy components predict degradation on representative circuits.

## Expected output
Noise profile, unstable-qubit list, mapping guidance, uncertainty estimates, and timestamps.

## Stop conditions
Stop when backend metadata is insufficient to attribute observed error or results vary beyond the experiment’s statistical resolution.