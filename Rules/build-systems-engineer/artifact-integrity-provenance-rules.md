# Artifact Integrity and Provenance Rules

## Purpose
Ensure build outputs can be traced to reviewed source, declared inputs, and known toolchains.

## Scope
Applies to binaries, packages, containers, generated archives, manifests, checksums, attestations, and release candidates.

## MUST
- Published artifacts MUST have a stable identity and integrity check such as a cryptographic digest.
- Provenance MUST identify the source revision, build configuration, toolchain, and producing workflow where practical.
- Release artifacts MUST be produced by controlled build paths rather than ad hoc local packaging.
- Artifact metadata changes MUST be reviewed when they can affect reproducibility, deployment, or compliance.
- Promotion between environments MUST preserve artifact identity unless rebuilding is explicitly required and documented.

## MUST NOT
- MUST NOT publish an artifact whose source revision or build configuration cannot be established.
- MUST NOT replace an immutable released artifact in place.
- MUST NOT treat filename equality as proof of artifact equality.

## SHOULD
- Provenance SHOULD be machine-verifiable and generated automatically.
- Artifact stores SHOULD enforce immutability for released versions.

## Exceptions
Any rebuild-on-promotion process MUST document why immutable promotion is not feasible and how equivalence is verified.

## Verification
Inspect digests, provenance records, release workflow logs, source revision metadata, and artifact-store immutability settings.