# Testing and Conformance

## Purpose
Build a test strategy that proves Wasm modules behave correctly across interfaces, runtimes, features, and failure conditions.

## When to use
Use for new modules, runtime upgrades, portability requirements, ABI changes, or regressions.

## Inputs
Requirements, runtime matrix, interfaces, feature baseline, test corpus, expected traps/errors, and compatibility policy.

## Context to inspect
Inspect unit/integration tests, spec/conformance tests, generated bindings, golden artifacts, feature flags, and CI runtime versions.

## Core knowledge
Passing source-language tests is insufficient when ABI, binary validation, host integration, or runtime portability matter. Conformance and differential testing can expose runtime-specific assumptions.

## Procedure
1. Map requirements to guest, boundary, and host-level tests.
2. Validate every produced binary.
3. Test imports/exports and malformed boundary inputs.
4. Cover expected traps and resource-limit failures.
5. Run against every supported runtime/version.
6. Add differential tests for semantically sensitive logic.
7. Test feature-disabled configurations where fallback is promised.
8. Include cold/warm and concurrency cases when relevant.
9. Pin test environments and artifact hashes.
10. Gate releases on the declared compatibility matrix.

## Decision points
Use golden binary snapshots sparingly because compiler upgrades legitimately change bytes; prefer semantic assertions unless binary stability is itself a requirement.

## Common failure patterns
Testing only one runtime; never testing traps; coupling tests to optimizer output; ignoring host binding generation; declaring portability from successful compilation alone.

## Verification
CI demonstrates validation, functional behavior, boundary errors, and runtime-matrix success from clean builds.

## Expected output
A layered, reproducible conformance suite tied to supported runtimes and interface guarantees.

## Stop conditions
Stop release when a contractual runtime fails, feature support is ambiguous, or flaky results prevent reliable verification.