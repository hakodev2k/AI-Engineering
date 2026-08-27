# CO-RE Portability

## Purpose
Build Compile Once – Run Everywhere eBPF programs that tolerate kernel type-layout differences using BTF and relocations.

## When to use
Use for multi-kernel distribution where rebuilding per target is undesirable.

## Inputs
Kernel support matrix, BTF sources, vmlinux definitions, libbpf tooling, field/type requirements.

## Context to inspect
Inspect target BTF availability, required types and fields, enum differences, optional members, loader feature probes, and packaging.

## Core knowledge
CO-RE relocations adapt type and field access but do not make unstable semantics stable. Portability requires capability detection, guarded optional fields, and explicit minimum support.

## Procedure
1. Define supported kernel families and required capabilities.
2. Generate or source trustworthy BTF-derived type definitions.
3. Replace layout assumptions with CO-RE-aware reads.
4. Guard optional fields/types with existence checks.
5. Avoid relying on kernel-version strings as the sole capability signal.
6. Build one artifact and test across the support matrix.
7. Validate relocation results and event semantics.
8. Define fallback or unsupported behavior.
9. Package BTF fallback assets only when justified.

## Decision points
Use CO-RE when target BTF and semantic stability are sufficient. Use per-kernel builds only when required semantics cannot be represented portably. Prefer capability probes to version branching.

## Common failure patterns
Assuming BTF exists everywhere, treating field existence as semantic equivalence, shipping stale vmlinux headers, unguarded enum assumptions, and testing only recent distributions.

## Verification
Load and exercise the same object on representative oldest/newest kernels and distribution variants; compare decoded values and fallback behavior.

## Expected output
A portable artifact with explicit compatibility matrix and guarded kernel dependencies.

## Stop conditions
Stop when required kernel semantics are fundamentally unstable or target environments lack the metadata needed for safe relocation.