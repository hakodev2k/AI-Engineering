# Build Reproducibility Rules

## Purpose
Make WebAssembly artifacts traceable to source, toolchain, interfaces, and configuration.

## Scope
Applies to compilers, linkers, component tooling, optimization, generated bindings, and packaging.

## MUST
- Release toolchain versions and build flags MUST be pinned or otherwise reproducibly resolved.
- Generated interfaces and bindings MUST derive from version-controlled sources.
- Release artifacts MUST be attributable to a source revision and build configuration.
- CI MUST build release artifacts in a controlled environment.
- Changes to compiler, linker, optimizer, or component tooling MUST run regression and compatibility tests.

## MUST NOT
- Release binaries MUST NOT depend on unrecorded local tool versions or manual post-build edits.
- Non-reproducible generated files MUST NOT be treated as authoritative source.
- Toolchain upgrades MUST NOT be merged solely because compilation succeeds.

## SHOULD
- Verify byte-for-byte reproducibility where ecosystem/tooling permits.
- Record artifact hashes and provenance metadata.
- Separate deterministic build inputs from environment-specific deployment configuration.

## Exceptions
When exact binary reproducibility is impossible, the differing inputs or nondeterministic sections must be identified and semantic equivalence verified.

## Verification
Rebuild from a clean environment, compare artifact hashes or normalized outputs, inspect lockfiles/tool manifests and flags, regenerate bindings, and run compatibility/security/performance regression gates after toolchain changes.