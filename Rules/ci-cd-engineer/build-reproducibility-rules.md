# Build Reproducibility Rules

## Purpose
Make build outputs traceable and repeatable from declared source and dependencies.

## Scope
Compilers, package managers, build images, generated code, and build metadata.

## MUST
- Builds MUST pin or constrain toolchains and dependencies sufficiently to avoid uncontrolled drift.
- Release artifacts MUST record source revision, build definition version, and relevant toolchain identity.
- Dependency restoration MUST use committed lock data when the ecosystem supports it.
- Generated code affecting shipped behavior MUST be reproducible or its provenance MUST be recorded.
- Build failures caused by environmental drift MUST be treated as engineering defects, not normalized as routine retries.

## MUST NOT
- MUST NOT depend on undeclared workstation state for release builds.
- MUST NOT fetch mutable, unverified build inputs when immutable or integrity-checked alternatives exist.
- MUST NOT claim reproducibility without rebuilding representative revisions and comparing expected outputs or functional equivalence.

## SHOULD
- Build environments SHOULD be ephemeral and versioned.
- Deterministic compiler/linker options SHOULD be enabled where practical.

## Exceptions
Non-deterministic inputs require documented necessity, bounded effect, provenance, validation method, and risk acceptance.

## Verification
Rebuild selected revisions in clean environments, inspect lockfiles and tool versions, compare hashes where deterministic output is expected, and verify provenance metadata on published artifacts.