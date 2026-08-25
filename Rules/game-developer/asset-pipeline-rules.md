# Asset Pipeline Rules

## Purpose
Keep authored content reproducible, validated, efficient, and safe to integrate.

## Scope
Importers, source assets, generated assets, metadata, compression, validation, and build transforms.

## MUST
- Generated game assets MUST be reproducible from versioned source inputs and documented tooling where practical.
- Import settings affecting runtime cost or quality MUST be reviewable and consistent with platform budgets.
- Automated validation MUST reject known-invalid asset dimensions, formats, references, or naming contracts where deterministic checks exist.
- Source and generated ownership MUST be clear to prevent manual edits being overwritten.

## MUST NOT
- MUST NOT commit secrets, licensed source material without authorization, or unnecessary generated intermediates.
- MUST NOT rely on undocumented workstation-local transformations for release content.

## SHOULD
- Expensive validation SHOULD run in CI or content build pipelines.

## Exceptions
Vendor-generated or opaque assets require documented provenance, license, and reproducibility limitations.

## Verification
Rebuild assets from clean checkout, run validators, inspect import diffs, compare artifact hashes where appropriate, and profile representative runtime assets.