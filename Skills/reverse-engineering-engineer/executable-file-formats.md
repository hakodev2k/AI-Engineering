# Executable File Formats

## Purpose
Analyze executable container structures accurately enough to locate code, data, metadata, relocations, dependencies, and loading behavior.

## When to use
Use when inspecting PE, ELF, Mach-O, firmware executables, object files, or shared libraries and when loader behavior matters.

## Inputs
Binary, target OS, architecture, format documentation, parser output.

## Preconditions
Work from an immutable copy and know whether the artifact is an executable, library, object, core image, or container.

## Context to inspect
Headers, sections/segments, virtual versus file offsets, permissions, imports, exports, relocations, symbol/string tables, dynamic-loader metadata, signatures, resources, and overlays.

## Core knowledge
On-disk layout differs from in-memory layout. Loader semantics, alignment, relocations, ASLR, dynamic linking, and format-specific indirection determine what addresses mean. Malformed or adversarial binaries can break naive parsers.

## Procedure
1. Validate magic, class, architecture, endianness, and header bounds.
2. Build a file-offset to virtual-address map.
3. Enumerate sections/segments and effective permissions.
4. Resolve entry points, imports, exports, relocations, and dynamic dependencies.
5. Inspect symbols, debug directories, resources, notes, signatures, and overlays.
6. Identify suspicious overlaps, impossible sizes, writable-executable regions, or parser inconsistencies.
7. Correlate format metadata with disassembler and loader observations.
8. Record address conventions used by subsequent analysis.

## Decision points
Use format-native metadata when trustworthy; fall back to raw byte analysis for malformed or intentionally deceptive samples. Prefer loader-equivalent mappings when reasoning about runtime addresses.

## Common failure patterns
Mixing RVA, VA, and file offsets; assuming section names are authoritative; ignoring relocations; trusting declared sizes without bounds checks; missing overlays or fat/universal architectures.

## Verification
Cross-check mappings with two parsers or with debugger memory maps. Confirm imported symbols and entry points resolve as expected under the target loader.

## Expected output
A precise structural map that downstream static and dynamic analysis can reference without address ambiguity.

## Stop conditions
Stop if parsing would require executing untrusted code, the artifact is incomplete, or contradictory metadata prevents a defensible mapping without additional evidence.