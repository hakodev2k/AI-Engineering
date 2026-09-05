# Dependency and License Rules

## Purpose
Prevent software dependencies from introducing unreviewed licensing or distribution obligations.

## Scope
Applies to libraries, packages, container images, copied source, generated assets, SDKs, and bundled components.

## MUST
- Third-party components MUST have identifiable source, version, and applicable license before release.
- License obligations MUST be evaluated against the intended use and distribution model.
- Restricted or incompatible components MUST block release until resolved or explicitly approved.
- Dependency inventory MUST be reproducible from build or package metadata where practical.

## MUST NOT
- MUST NOT treat package availability as evidence that its license is acceptable.
- MUST NOT remove required attribution or notice material.

## SHOULD
- Automate license detection and policy checks in CI while retaining human review for ambiguous cases.

## Exceptions
Exceptions require legal or authorized compliance review, documented scope, risk, conditions, and approval.

## Verification
Inspect dependency manifests, lockfiles, scan reports, license records, notices, and release artifacts.