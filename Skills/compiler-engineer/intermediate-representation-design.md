# Intermediate Representation Design

## Purpose
Design IRs that make semantics explicit, support reliable transformations, and provide stable compiler-stage contracts.

## When to use
Use when introducing an IR, changing instruction semantics, adding control/data representation, or fixing pass fragility.

## Inputs
Source semantics, target needs, existing IR, optimization requirements, debug/source mapping constraints.

## Context to inspect
Instruction set, types, CFG model, SSA form, metadata, ownership/lifetime rules, serialization, verifier, pass consumers.

## Core knowledge
An IR should encode invariants cheaply enough to verify. Canonical forms reduce pass complexity. Undefined/poison semantics, side effects, aliasing, exceptions, and memory ordering must be explicit.

## Procedure
1. List semantics the IR must preserve.
2. Identify analyses and transforms it must enable.
3. Define instructions, operands, types, blocks, effects, and metadata.
4. Specify invariants and illegal states.
5. Build or extend an IR verifier.
6. Define lowering from the previous level and to the next.
7. Preserve source/debug information deliberately.
8. Add round-trip, verifier-negative, and optimization interaction tests.

## Decision points
Use SSA when data-flow optimization benefits justify phi/block-argument complexity. Keep high-level operations until semantic information is no longer useful; lower early only when simplification outweighs lost context.

## Common failure patterns
Implicit side effects, unverifiable invariants, target leakage, ambiguous undefined behavior, metadata becoming semantically required, passes constructing transient invalid IR.

## Verification
Run verifier after transformations in debug/test configurations, compile representative programs, and compare semantics before/after lowering.

## Expected output
A documented IR contract with verifier coverage and migration impact.

## Stop conditions
Escalate when semantics cannot be represented without breaking existing pass assumptions or serialized compatibility.