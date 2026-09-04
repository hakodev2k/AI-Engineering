# Reproducible Build Rules

## Purpose
Increase confidence that reviewed source and declared inputs produce expected artifacts and expose hidden or mutable build dependencies.

## Scope
Applies where deterministic or near-deterministic builds are technically feasible and valuable for production software.

## MUST
- Teams claiming reproducible builds MUST define the expected reproducibility boundary and tolerated nondeterminism.
- Build inputs required for reproduction MUST be captured, versioned, or otherwise documented.
- Differences between independent builds of high-assurance artifacts MUST be investigated before declaring equivalence.
- Reproducibility checks MUST compare cryptographic digests or normalized outputs appropriate to the artifact format.

## MUST NOT
- A build MUST NOT be called reproducible merely because it succeeds twice.
- Hidden downloads, timestamps, environment-dependent generators, or mutable inputs MUST NOT be ignored when they materially affect output.
- Reproducibility claims MUST NOT replace provenance, signing, or authorization controls.

## SHOULD
- Critical artifacts SHOULD be independently rebuilt periodically when ecosystem tooling permits.
- Build processes SHOULD minimize nondeterministic metadata and undeclared environment dependencies.

## Exceptions
Exceptions require documented technical limitation, residual risk, compensating integrity evidence, and periodic review.

## Verification
Run independent rebuilds, compare digests or normalized outputs, inspect build logs and network access, and review declared toolchain and dependency versions.