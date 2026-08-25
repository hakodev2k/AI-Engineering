# Build System Rules
## Purpose
Ensure builds are deterministic, observable, and efficient.
## Scope
Compilation, packaging, code generation, dependency resolution, and build orchestration.
## MUST
- Builds MUST declare all material inputs and produce reproducible outputs where tooling permits.
- Build failures MUST identify the failing target and preserve useful diagnostics.
- Changes to build graph or caching MUST be measured on representative clean and incremental builds.
- Generated artifacts MUST have a clear source of truth and regeneration command.
## MUST NOT
- MUST NOT depend on undeclared network, clock, user-home, or mutable global state when avoidable.
- MUST NOT claim build-speed improvement without before/after evidence.
## SHOULD
- Expensive independent work SHOULD be parallelized only when resource contention is measured.
## Exceptions
Document nondeterministic inputs, containment, impact, and verification.
## Verification
Compare repeated clean builds, inspect dependency graphs, cache hit rates, timings, and CI reproducibility.