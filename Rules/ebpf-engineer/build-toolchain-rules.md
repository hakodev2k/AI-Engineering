# Build and Toolchain

## Purpose
Keep eBPF artifacts reproducible, auditable, and compatible with declared targets.

## Scope
Clang/LLVM, libbpf, bpftool, BTF generation, skeleton generation, flags, dependencies, and artifacts.

## MUST
- Toolchain versions affecting bytecode or generated interfaces MUST be controlled and recorded.
- Builds MUST be reproducible enough to trace deployed bytecode to source and inputs.
- Compiler warnings relevant to correctness MUST be treated as actionable.
- Generated skeletons/headers MUST be regenerated through a documented deterministic process.
- Dependency upgrades MUST run verifier, compatibility, and regression tests.

## MUST NOT
- MUST NOT deploy locally built opaque artifacts without provenance.
- MUST NOT silently change compiler flags that alter target architecture, debug/BTF data, optimization, or semantics.
- MUST NOT assume a newer toolchain preserves old verifier compatibility.

## SHOULD
- Pin major build dependencies and update deliberately.
- Retain artifact metadata sufficient for incident reconstruction.

## Exceptions
Emergency toolchain deviations require recorded versions, rationale, validation, and follow-up normalization.

## Verification
Compare CI build metadata, dependency locks, artifact hashes, BTF sections, generated files, and reproducibility checks.