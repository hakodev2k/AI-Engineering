# Quantum Error Correction

## Purpose
Reason about logical qubits, error-correcting codes, syndrome extraction, thresholds, and fault-tolerant execution when evaluating scalable quantum software.

## When to use
Use for fault-tolerant algorithm planning, logical resource estimation, code-aware architecture, or when translating physical error rates into logical execution requirements.

## Inputs
Algorithm circuit, target logical error budget, physical error assumptions, candidate code family, architecture constraints, and latency model.

## Context to inspect
Code distance, stabilizer layout, syndrome cycle, decoder assumptions, logical gate implementation, magic-state needs, and hardware connectivity.

## Core knowledge
Quantum error correction encodes logical information redundantly without copying arbitrary states. Logical reliability depends on code, physical error model, code distance, decoder, and fault-tolerant gate construction. Logical gate cost can dominate algorithm resources.

## Procedure
1. Define the algorithm-level failure probability budget.
2. Identify logical qubits and logical operations.
3. Select candidate codes compatible with hardware assumptions.
4. Estimate required code distance from physical error rates.
5. Include syndrome extraction and decoding latency.
6. Identify expensive non-Clifford operations and distillation requirements.
7. Model logical qubit and spacetime overhead.
8. Run sensitivity analysis over physical error assumptions.
9. Separate demonstrated hardware capability from projected capability.
10. Feed logical costs back into algorithm design.

## Decision points
Choose code families based on hardware geometry, noise, gate set, and decoder feasibility—not headline thresholds alone.

## Common failure patterns
Counting physical qubits without time overhead, ignoring magic-state factories, assuming independent errors, using threshold values outside their model, and treating code distance as a fixed universal constant.

## Verification
Cross-check resource equations, simulate representative logical error behavior where possible, and compare estimates under multiple plausible physical error rates.

## Expected output
A fault-tolerant resource model, explicit assumptions, dominant overheads, and architecture implications.

## Stop conditions
Stop when physical-error assumptions are unsupported, decoder performance is unknown for the target regime, or the logical failure budget cannot be met with credible resources.