# BPF Verifier Debugging

## Purpose
Diagnose verifier rejection systematically and produce safe changes rather than weakening program logic blindly.

## When to use
Use when load fails with verifier errors, state explosion, invalid memory access, pointer-type conflicts, or boundedness failures.

## Inputs
Verifier log, compiled object, source, kernel version/config, BTF, compiler flags, loader output.

## Context to inspect
Inspect exact program type, helper availability, generated instructions, branch structure, pointer provenance, stack use, loops, and kernel-specific verifier behavior.

## Core knowledge
The verifier reasons over abstract states, pointer provenance, bounds, initialization, helper contracts, and control-flow paths. Source code alone can obscure the instruction sequence being verified.

## Procedure
1. Capture the complete verifier log at useful verbosity.
2. Identify the first causal rejection rather than downstream messages.
3. Map rejected instructions to source/disassembly.
4. Classify the issue: bounds, pointer provenance, initialization, helper contract, loop, stack, or state explosion.
5. Reduce ambiguous control flow and make bounds explicit.
6. Preserve semantics while simplifying verifier reasoning.
7. Recompile and compare instruction/control-flow changes.
8. Retest on minimum and maximum supported kernels.
9. Add regression coverage for the triggering path.

## Decision points
Use source refactoring first; use bounded helpers or map indirection when structurally appropriate. Do not trade verifier acceptance for unchecked semantics. If behavior differs by kernel, gate by detected capability rather than version strings alone.

## Common failure patterns
Fixing the last log line, random casts, losing pointer checks across branches, excessive inlining, oversized stack frames, exploding state combinations, and testing only one kernel.

## Verification
A load success is necessary but insufficient. Exercise edge inputs, inspect generated instructions, run functional tests, and confirm no semantic regression or material overhead increase.

## Expected output
A minimal verifier-safe change with root-cause explanation and compatibility evidence.

## Stop conditions
Escalate when acceptance would require unsafe memory reasoning, unsupported helpers, or dropping required semantics.