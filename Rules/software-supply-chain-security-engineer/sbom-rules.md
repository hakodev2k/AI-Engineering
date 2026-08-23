# SBOM Rules

## Purpose
Maintain reliable software component inventories for vulnerability response, licensing, and provenance analysis.

## Scope
Build artifacts, deployable packages, containers, firmware, and released software products.

## MUST
- Released artifacts MUST have an SBOM generated from the actual build inputs or final artifact contents.
- SBOMs MUST identify component names, versions, dependency relationships, and package identifiers where available.
- SBOM generation MUST be reproducible and integrated into the release pipeline.
- SBOMs MUST be retained and traceable to immutable release identifiers.
- Material discrepancies between declared dependencies and artifact contents MUST be investigated.

## MUST NOT
- MUST NOT treat a stale manually maintained component list as an authoritative SBOM.
- MUST NOT publish sensitive internal metadata in externally distributed SBOMs without review.

## SHOULD
- SBOM format SHOULD use interoperable standards supported by downstream tooling.
- SBOMs SHOULD include provenance and license metadata when reliable.

## Exceptions
Any product unable to generate an SBOM requires documented technical constraints, risk assessment, mitigation, owner, and remediation date.

## Verification
Compare SBOMs against package manifests, artifact scans, container inventories, release identifiers, and retention records.