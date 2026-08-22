# Dependency License Evidence Capture

## Purpose
Create an evidence-backed inventory for dependency additions and upgrades before an AI agent recommends merge or release.

## When to use
Use when a task adds, upgrades, replaces, vendors, or changes the source of a package, library, container image, generated client, CLI, binary, or copied third-party component.

## Inputs
- Base dependency inventory or lockfile state.
- Candidate dependency inventory or lockfile state.
- Package manager and ecosystem.
- Direct/transitive dependency relationship when available.
- Repository distribution/use context.
- Policy file: `config/license-policy.json`.

## Preconditions
- The candidate dependency version/source is known.
- Evidence can be traced to a package manifest, lockfile, SBOM, package registry metadata, repository license file, package metadata, or an explicitly supplied legal review record.

## Allowed tools
- Read-only repository inspection.
- Package-manager metadata commands that do not mutate lockfiles.
- Registry/package metadata lookup.
- Official upstream repository/package pages.
- `scripts/validate-license-inventory.py`.

## Constraints
- Do not install or upgrade dependencies merely to discover license metadata when static metadata is sufficient.
- Do not infer a license from package name, author, popularity, or a similar package.
- Do not convert `unknown` into an allowed license without evidence.
- Do not copy license text from unrelated versions.

## Procedure
1. Identify dependency additions, removals, upgrades, source changes, and vendored-code additions.
2. For every new or changed dependency, record ecosystem, package name, candidate version, source/provenance, direct/transitive status, and change type.
3. Collect license evidence in descending preference: candidate artifact/package metadata; candidate source tag/commit license file; official registry metadata; approved internal legal record.
4. Normalize the observed license identifier to an SPDX identifier only when the evidence is unambiguous. Preserve the raw observed value separately.
5. For dual/multi-license packages, preserve the complete expression, such as `MIT OR Apache-2.0`; do not silently select one branch.
6. Compute or capture an immutable evidence reference where practical: package version, source commit, artifact digest, URL, file path, or supplied record ID.
7. Record evidence confidence: `verified`, `partial`, or `unknown`.
8. Mark package provenance `verified` only when the evidence belongs to the exact candidate version/source or an explicitly documented version range.
9. Produce the inventory contract defined by `schemas/license-inventory.schema.json`.
10. Run `python scripts/validate-license-inventory.py --inventory <path> --policy config/license-policy.json`.

## Expected output
A machine-readable license inventory containing only evidence-backed dependency/license records.

## Verification
- Every changed dependency has one inventory record.
- Every record has exact package/version/source identity.
- `verified` evidence contains a source reference.
- Unknown or ambiguous evidence remains explicitly unknown/partial.
- Validator exits 0.

## Failure handling
- Registry/tool timeout: retry once; preserve the failed lookup evidence.
- Missing license metadata: mark `unknown`; do not guess.
- Conflicting metadata: mark `partial`, record all evidence references, and escalate to review.
- Permission failure: stop collection for the affected source and report the missing evidence.

## Stop conditions
Stop before policy approval when any changed dependency lacks a valid inventory record, exact version/source identity, or sufficient provenance evidence.