# Quantum Simulation Validation

## Purpose
Use simulators correctly to validate quantum programs before hardware execution while understanding when simulator evidence is insufficient.

## When to use
Use during algorithm development, regression testing, state inspection, noise studies, and backend-independent debugging.

## Inputs
Circuit, expected state or distribution, simulator capabilities, noise assumptions, precision requirements, and representative inputs.

## Preconditions
Expected behavior must be defined for at least small or analytically tractable cases.

## Context to inspect
Qubit ordering, simulator method, numerical precision, shot mode versus exact probabilities, noise model, memory limits, and framework seeds.

## Core knowledge
State-vector simulation scales exponentially in qubit count. Density-matrix simulation is more expensive but represents mixed states. Tensor-network and stabilizer methods exploit structure and may not apply generally. Shot-based simulation introduces sampling uncertainty even without physical noise.

## Procedure
1. Select the simplest simulator that preserves the behavior under test.
2. Validate tiny cases analytically.
3. Compare exact-state and shot-based results when both are relevant.
4. Inspect intermediate states only in debugging configurations.
5. Add realistic noise only after noiseless correctness is established.
6. Sweep seeds or shot counts to separate deterministic defects from statistical variation.
7. Monitor simulator memory and numerical limits.
8. Compare multiple simulation methods for suspicious cases.
9. Record simulator version and configuration.
10. Define what must still be verified on hardware.

## Decision points
Use exact probabilities for semantic checks and shots for sampling behavior. Use density matrices when decoherence or mixed states matter; use specialized simulators only when circuit structure justifies them.

## Common failure patterns
Treating simulator success as hardware readiness, confusing statistical fluctuations with defects, using unrealistic noise, exhausting memory with unnecessary state vectors, and validating only one seed.

## Verification
Compare against analytic cases, check normalization, confidence intervals, repeatability, and consistency across suitable simulator methods.

## Expected output
Validated simulator results, documented configuration, identified limitations, and a hardware-validation plan.

## Stop conditions
Stop when simulation cost is infeasible, the simulator cannot model required hardware behavior, or expected results are undefined.