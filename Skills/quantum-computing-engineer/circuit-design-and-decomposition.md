# Circuit Design and Decomposition

## Purpose
Design quantum circuits that preserve algorithm semantics while controlling depth, two-qubit gate count, ancilla use, and hardware compatibility.

## When to use
Use when turning an algorithm into executable circuits or reducing an existing circuit before transpilation. Do not optimize blindly without a correctness oracle.

## Inputs
Logical operation, target gate set, hardware topology, qubit budget, depth budget, and correctness tests.

## Preconditions
The logical algorithm and expected outputs are validated independently.

## Context to inspect
Native gates, connectivity graph, decomposition rules, commutation opportunities, ancilla availability, measurement points, and reset support.

## Core knowledge
Two-qubit gates are usually the dominant error source. Equivalent circuits can differ substantially in fidelity and routing cost. Decomposition must preserve unitary semantics, relative phase where relevant, and control structure.

## Procedure
1. Start from a validated logical circuit.
2. Identify expensive multi-qubit and non-native operations.
3. Choose decompositions compatible with the target gate set.
4. Exploit cancellation and safe commutation.
5. Minimize unnecessary controls and ancillas.
6. Evaluate depth and two-qubit count after each major change.
7. Preserve barriers only when semantically required.
8. Compare alternative decompositions under target topology.
9. Simulate equivalence on representative states.
10. Record resource deltas and hardware assumptions.

## Decision points
Trade ancillas for depth only when reset and qubit availability justify it. Prefer lower two-qubit count over cosmetic one-qubit reductions on noisy hardware.

## Common failure patterns
Optimizing before validating, breaking relative phase, introducing excessive SWAP pressure, retaining unnecessary barriers, and assuming a generic gate count predicts hardware fidelity.

## Verification
Use unitary/statevector equivalence for tractable circuits, known-answer tests, and transpiled resource metrics. Verified means semantics and resource improvement are both demonstrated.

## Expected output
Optimized logical circuit, decomposition rationale, resource comparison, equivalence evidence, and target-backend assumptions.

## Stop conditions
Stop when further reduction risks semantic correctness or depends on undocumented hardware behavior.