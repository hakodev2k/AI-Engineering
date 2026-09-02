# Quantum Debugging

## Purpose
Diagnose incorrect quantum program behavior systematically across mathematical formulation, circuit construction, transpilation, sampling, and backend execution.

## When to use
Use when outputs disagree with expectations, simulator and hardware results diverge, or a circuit changes behavior after optimization or migration.

## Inputs
Failing circuit, expected result, source code, transpiled circuit, simulator traces, backend metadata, calibration data, logs, and seeds.

## Context to inspect
Qubit order, basis convention, parameter binding, measurement mapping, ancilla lifecycle, transpiler transformations, shot count, post-processing, and backend configuration.

## Core knowledge
Quantum bugs often appear as distribution shifts rather than deterministic exceptions. Debug from the smallest semantic layer upward: mathematics, logical circuit, simulator, transpilation, noise, hardware, then classical post-processing.

## Procedure
1. Freeze the failing inputs, versions, seeds, and backend metadata.
2. Reproduce on the smallest circuit and input possible.
3. Validate classical preprocessing and expected mathematics independently.
4. Run an ideal simulator and inspect intermediate states where feasible.
5. Check qubit indexing, control/target orientation, parameters, and measurement mapping.
6. Compare logical and transpiled circuits.
7. Increase shots to distinguish sampling noise from systematic error.
8. Compare ideal, noisy simulation, and hardware results.
9. Inspect calibration and hardware-specific failures only after logical correctness is established.
10. Reduce the failure to a minimal reproducible circuit.
11. Add a regression test before finalizing the fix.

## Decision points
Use state inspection for small circuits; use invariant checks and circuit reduction when state vectors are infeasible. Suspect hardware only after simulator and transpilation paths are understood.

## Common failure patterns
Changing multiple variables at once, blaming noise for logic defects, forgetting bit-order conversions, debugging post-processed data without retaining raw counts, and accepting a non-reproducible fix.

## Verification
Reproduce the original failure, demonstrate the root cause, verify the corrected behavior across representative inputs, and confirm the new regression test fails without the fix.

## Expected output
A root-cause statement, minimal reproduction, validated fix, regression protection, and any remaining hardware uncertainty.

## Stop conditions
Stop when the issue cannot be reproduced, required raw execution metadata is missing, or backend behavior requires provider investigation beyond available evidence.