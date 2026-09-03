# Compiler Architecture and IR

## Purpose
Design or assess the intermediate-representation strategy for an LLM compiler. The skill ensures model semantics survive transformation while giving optimization passes enough structure to reason about tensors, effects, layouts, devices, and execution constraints.

## When to use
Use when introducing a compiler pipeline, adding a new IR level, integrating a frontend, diagnosing pass-ordering problems, or deciding where an optimization belongs.

## Inputs
- Model/frontend representation
- Existing IR definitions and pass pipeline
- Target runtimes and accelerators
- Operator semantics
- Dynamic-shape and control-flow requirements
- Performance and portability goals

## Preconditions
Understand the current compilation stages and the runtime contract. Do not assume SSA, static shapes, pure operators, or one-device execution unless verified.

## Context to inspect
Inspect graph import, type system, side-effect modeling, shape metadata, device placement, layout representation, constants, aliasing rules, pass manager, serialization, and backend interfaces.

## Core knowledge
A useful LLM compiler often needs multiple abstraction levels: graph/model IR, tensor/operator IR, loop/kernel IR, and target code. IR design must preserve semantics while making desired transformations explicit. SSA simplifies dataflow reasoning; effect systems are required when state, mutation, RNG, collectives, or host callbacks exist. Canonical forms reduce pass complexity but can erase high-level intent if lowered too early.

## Procedure
1. Define semantic invariants each IR level must preserve.
2. Inventory optimization decisions needed at each stage.
3. Identify information that must survive lowering: shapes, dtypes, layouts, devices, aliasing, effects, symbolic constraints.
4. Separate canonicalization from target-specific lowering.
5. Define verifier rules for every IR level.
6. Specify legal transformation boundaries between passes.
7. Design pass ordering and invalidation rules.
8. Add textual or structural dump support for debugging.
9. Define round-trip or import/export requirements where relevant.
10. Add representative models and adversarial graphs to validation.

## Decision points
Use a high-level graph IR when whole-model reasoning matters. Lower to tensor/loop IR only after high-level fusion or partitioning decisions are complete. Preserve symbolic shapes when deployment workloads require dynamic inputs; specialize when shape stability provides material performance benefit.

## Common failure patterns
- Lowering high-level semantics too early.
- Missing effect or alias modeling.
- Passes relying on undocumented IR invariants.
- Target-specific assumptions leaking into portable stages.
- No verifier, causing invalid IR to fail much later.

## Verification
An IR change is implemented when parsing/building and passes work. It is verified when IR verifiers pass, semantic regression tests match reference execution, invalid forms are rejected, and representative models compile across intended backends.

## Expected output
An IR design or change set with explicit invariants, pass boundaries, verification rules, and compatibility impact.

## Stop conditions
Stop when operator semantics are ambiguous, required runtime behavior is undocumented, or the proposed representation cannot model necessary effects or dynamic constraints without unsafe assumptions.