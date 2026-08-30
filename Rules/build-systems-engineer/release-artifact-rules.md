# Release Artifact Rules

## Purpose
Ensure release outputs are complete, stable, traceable, and produced through controlled build paths.

## Scope
Applies to release packages, archives, binaries, containers, manifests, symbols, metadata, and publication staging.

## MUST
- Release artifacts MUST be generated from an identified source revision using a reviewed release configuration.
- Required files, metadata, symbols, licenses, and manifests MUST be validated before publication.
- Release packaging MUST be deterministic where practical and MUST preserve artifact identity during promotion.
- Breaking changes to artifact layout or naming MUST be coordinated with downstream consumers.
- Release candidates MUST pass the same validation used for final artifacts unless an explicitly documented gate differs.

## MUST NOT
- MUST NOT assemble final release artifacts manually from unrelated build outputs.
- MUST NOT publish partially successful packaging results.
- MUST NOT mutate an already released version in place.

## SHOULD
- Packaging validation SHOULD run automatically and include structural and integrity checks.
- Release artifacts SHOULD be retained according to documented recovery and compliance needs.

## Exceptions
Any manual or nonstandard packaging path MUST document reason, exact procedure, independent verification, and approval.

## Verification
Inspect source revision metadata, packaging manifests, artifact digests, required-file checks, release workflow logs, and downstream compatibility tests.