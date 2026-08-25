# Packed and Obfuscated Binary Analysis

## Purpose
Recognize and safely analyze binaries whose code or data is transformed to resist ordinary static analysis.

## When to use
Use when entropy, tiny import tables, runtime code generation, opaque control flow, string decoding, or inconsistent disassembly indicates packing or obfuscation.

## Inputs
Binary, triage evidence, isolated runtime, debugger/tracer, memory-dump capability.

## Preconditions
Do not assume high entropy alone proves packing or malicious intent. Preserve the original sample.

## Context to inspect
Entry stub, memory permissions, decompression/decryption loops, import resolution, writes to executable memory, control transfers, anti-analysis checks, and unpacked module boundaries.

## Core knowledge
Packing compresses/encrypts payload representation; obfuscation transforms semantics or control flow. Analysis should recover enough normal representation to answer the authorized question, not defeat every protection.

## Procedure
1. Establish evidence that transformation exists.
2. Identify loader/stub boundaries and runtime dependencies.
3. Observe allocation, writes, permission changes, and indirect transfers.
4. Capture memory after stable code/data materializes.
5. Reconstruct mappings/imports only as needed for analysis.
6. Re-run static analysis on recovered regions.
7. For control-flow obfuscation, simplify only patterns supported by semantics.
8. Document transformation stages and confidence.

## Decision points
Prefer runtime capture for standard packers or self-decryption; use static simplification for localized opaque predicates or dispatcher patterns. Avoid unnecessary protection bypass if behavior can be established another way.

## Common failure patterns
Dumping too early; assuming one unpacking layer; rebuilding an invalid image; confusing JIT behavior with packing; spending time fully deobfuscating irrelevant code.

## Verification
Recovered code should disassemble coherently, exhibit stable cross-references, and match observed runtime execution. Repeat capture from a clean state.

## Expected output
An analyzable representation or focused semantic explanation, plus the transformation path used to obtain it.

## Stop conditions
Stop if protection bypass exceeds authorization, execution cannot be contained, or additional deobfuscation adds no value to the investigation goal.