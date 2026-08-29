# License Compliance Rules

## Purpose
Prevent software supply-chain decisions from creating unmanaged licensing or redistribution obligations.

## Scope
Applies to third-party packages, vendored source, generated code, container images, fonts, assets, SDKs, and redistributed binaries.

## MUST
- Third-party components MUST have identifiable licensing information before approved redistribution when licensing applies.
- License obligations that affect attribution, source disclosure, redistribution, or commercial use MUST be identified and routed for appropriate review.
- Dependency or base-image changes MUST be checked for material license changes where tooling or policy requires it.
- Required notices MUST accompany releases when applicable.

## MUST NOT
- MUST NOT assume a public repository or downloadable package is unrestricted for reuse.
- MUST NOT remove required notices or provenance metadata solely to simplify packaging.

## SHOULD
- Automated license inventory SHOULD be integrated with dependency and SBOM workflows.
- Ambiguous licensing SHOULD be resolved before adoption when the component is material to the product.

## Exceptions
Exceptions MUST document the component, ambiguity or obligation, business need, legal or policy review where required, risk, and approval.

## Verification
Inspect dependency inventories, SBOMs, notices, package metadata, container contents, and review records. Confirm distributed components have documented license disposition.