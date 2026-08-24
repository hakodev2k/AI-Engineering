# Code Generation Rules

## Purpose
Generate target code that is correct, ABI-conformant, and inspectable.

## Scope
Instruction selection, lowering, machine IR, scheduling, and emission.

## MUST
- Code generation MUST honor target ISA semantics and enabled feature sets.
- Unsupported operations MUST lower through a defined legal path or produce a clear diagnostic.
- Target-specific transformations MUST preserve source-visible behavior.
- Generated code tests MUST cover boundary immediates, addressing modes, and uncommon legal forms.

## MUST NOT
- MUST NOT emit instructions unavailable in the declared target configuration.
- MUST NOT rely on assembler correction for semantically invalid codegen.
- MUST NOT introduce undefined machine state that later phases assume initialized.

## SHOULD
- Selection rules SHOULD separate legality from cost.
- Emission SHOULD be deterministic for identical inputs and options.

## Exceptions
Experimental target features require explicit gating and documented support status.

## Verification
Use assembler/disassembler round trips, emulator or hardware tests, instruction-level regression tests, and differential execution.