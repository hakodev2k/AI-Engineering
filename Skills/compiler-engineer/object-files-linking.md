# Object Files and Linking

## Purpose
Produce correct relocatable objects and integrate with linkers, loaders, archives, and platform binary formats.

## When to use
Use for target ports, relocation bugs, symbol visibility, sections, LTO integration, or linker failures.

## Inputs
Object format specification, target ABI, assembler/linker behavior, generated objects, failure diagnostics.

## Context to inspect
ELF/COFF/Mach-O writer, sections, symbols, relocations, COMDAT/weak rules, TLS, unwind/debug sections, linker flags.

## Core knowledge
Object generation bridges compiler semantics and platform tooling. Relocation type, addend model, symbol binding, section flags, alignment, and visibility must match linker expectations.

## Procedure
1. Identify object-format and linker contract.
2. Map emitted entities to sections and symbols.
3. Select relocation types from instruction/data semantics.
4. Validate addends, widths, ranges, and PC-relative bases.
5. Implement visibility, weak/COMDAT, TLS, and alignment rules.
6. Inspect generated objects with binary utilities.
7. Link against independent objects/libraries.
8. Add relocation-range and symbol-resolution tests.

## Decision points
Emit assembler when leveraging mature platform assemblers is acceptable; direct object emission when performance/control justify format complexity.

## Common failure patterns
Wrong relocation base, symbol binding mismatch, section alignment errors, duplicate COMDAT semantics, hidden-symbol leakage, truncated relocations.

## Verification
Object inspection, cross-linker tests, dynamic-loader tests, executable execution, and reproducible-build checks.

## Expected output
Portable object emission with explicit linker compatibility evidence.

## Stop conditions
Escalate unsupported relocation/object-format requirements or ambiguous platform toolchain contracts.