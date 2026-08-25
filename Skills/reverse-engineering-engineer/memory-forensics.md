# Process Memory Forensics

## Purpose
Analyze process memory to recover runtime-only code, data structures, decrypted content, module state, and evidence of corruption or compromise.

## When to use
Use when important state exists only at runtime or when dumps are available from crashes/incidents.

## Inputs
Memory dump or authorized live process, OS/architecture details, module binaries, symbols where available, incident question.

## Preconditions
Preserve dump integrity and handle memory as sensitive data; it may contain secrets and personal information.

## Context to inspect
Virtual memory map, loaded modules, stacks, heaps, executable mappings, thread contexts, handles, mapped files, strings, object signatures, and allocator metadata.

## Core knowledge
Memory is a point-in-time view and may contain stale freed data. ASLR, copy-on-write, guard pages, allocator metadata, JIT regions, and partial dumps affect interpretation.

## Procedure
1. Hash and preserve the dump.
2. Confirm process identity, architecture, and capture type.
3. Reconstruct memory regions and module mappings.
4. Inspect thread stacks and exception context if relevant.
5. Identify private executable or anomalous mappings.
6. Recover target objects using signatures, xrefs, and allocator evidence.
7. Compare in-memory modules with on-disk images when useful.
8. Extract only necessary artifacts and record offsets/addresses.
9. Correlate findings with logs, static analysis, or runtime traces.

## Decision points
Prefer dump analysis for repeatability; use live memory only when transient state cannot otherwise be captured. Treat carved strings and stale heap content as weak evidence unless referenced by active structures.

## Common failure patterns
Assuming every byte is live; mishandling ASLR; exposing secrets in reports; confusing mapped files with anonymous memory; relying on one carving heuristic.

## Verification
Confirm recovered structures through pointers, region permissions, owning threads/modules, and independent artifacts where possible.

## Expected output
A provenance-preserving memory analysis with addressable evidence and confidence.

## Stop conditions
Stop if required memory access is unauthorized, dump scope violates data policy, or evidence integrity cannot be maintained.