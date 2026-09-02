# Dependency and Build Efficiency Rules

## Purpose
Reduce avoidable build, dependency, and artifact overhead while preserving reproducibility, supply-chain security, and developer productivity.

## Scope
Applies to package dependencies, compilation, container images, generated artifacts, dependency resolution, and build caching.

## MUST
- Material dependencies MUST have a functional justification and lifecycle owner.
- Build optimization MUST preserve reproducibility, integrity verification, security scanning, and deterministic dependency resolution where required.
- Large or frequently rebuilt artifacts MUST be assessed for unnecessary layers, files, dependencies, and repeated work.

## MUST NOT
- MUST NOT remove integrity checks, signing, vulnerability scanning, or lockfile controls solely to shorten builds or reduce compute use.
- MUST NOT introduce broad dependencies for trivial functionality when their recurring build and operational cost is material and a simpler maintained alternative exists.
- MUST NOT rely on stale build caches when correctness or security requires invalidation.

## SHOULD
- Prefer incremental builds, dependency caching, remote caching, and minimal build contexts when correctness permits.
- Remove obsolete dependencies and generated artifacts through reviewed automation.
- Measure build time and compute consumption for high-frequency pipelines.

## Exceptions
Exceptions require the dependency or build constraint, alternatives considered, supply-chain risk, maintenance cost, and verification approach.

## Verification
Inspect dependency graphs, lockfiles, image layers, build traces, cache hit rates, CI compute usage, security checks, and reproducibility tests.
