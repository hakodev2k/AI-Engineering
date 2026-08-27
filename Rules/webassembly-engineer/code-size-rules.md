# Code Size Rules

## Purpose
Control artifact size without sacrificing correctness, debuggability, or required functionality.

## Scope
Applies to wasm binaries/components, symbols, metadata, dependencies, compression, and delivery packaging.

## MUST
- Size-sensitive products MUST define an artifact-size budget and track it in CI.
- Significant size regressions MUST identify their source before acceptance.
- Release stripping and optimization settings MUST be reproducible.
- Required licensing, provenance, and security metadata MUST be retained even when optimizing size.
- Debug artifacts needed for production symbolication MUST be preserved separately when stripped from deployable binaries.

## MUST NOT
- Dead-code elimination or stripping MUST NOT remove required exports, reflection metadata, initialization, or diagnostics without tests proving correctness.
- Dependencies MUST NOT be added to size-constrained modules without evaluating their binary contribution.
- Compression ratio MUST NOT be confused with in-memory or compiled-code footprint.

## SHOULD
- Use size attribution tooling to identify dominant functions and dependencies.
- Prefer feature gating over shipping unused functionality.
- Compare raw, compressed, and runtime footprint when delivery and memory both matter.

## Exceptions
A budget increase requires documented product value, alternatives considered, measured impact, and approval from the owning team.

## Verification
Record artifact sizes in CI, diff section/function attribution, test optimized release artifacts, and confirm separate debug symbols can resolve production stack traces.