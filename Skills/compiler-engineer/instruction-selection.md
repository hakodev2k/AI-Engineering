# Instruction Selection

## Purpose
Lower target-independent operations into legal, efficient machine instructions while preserving semantics.

## When to use
Use when adding target support, new operations, addressing modes, combines, or fixing backend legality/performance issues.

## Inputs
Target ISA, machine model, legalized IR, ABI constraints, code-generation tests and benchmarks.

## Context to inspect
Selection DAG/pattern matcher/global selector, legalization, addressing modes, immediate constraints, feature predicates, machine IR.

## Core knowledge
Instruction selection balances legality, pattern coverage, code quality, compile time, and target feature availability. Selection must not assume register allocation outcomes that are not guaranteed.

## Procedure
1. Specify source operation semantics precisely.
2. Enumerate legal target encodings and feature requirements.
3. Identify canonical input forms.
4. Add patterns or selection logic with explicit predicates.
5. Handle unsupported forms through legalization.
6. Preserve flags, side effects, and chain/order dependencies.
7. Add exact-codegen tests plus semantic execution tests.
8. Benchmark important kernels and inspect generated assembly.

## Decision points
Use declarative patterns for regular mappings; custom selection for context-sensitive or multi-instruction cases. Prefer robust patterns over fragile peepholes.

## Common failure patterns
Wrong immediate range, missing feature guard, flag clobbering, illegal addressing mode, phase-order dependence, pattern shadowing.

## Verification
Run backend tests across feature sets, execute generated code, inspect assembly, and benchmark representative workloads.

## Expected output
Legal target code with stable pattern coverage and measured quality.

## Stop conditions
Stop when ISA/ABI semantics or required target feature guarantees are unresolved.