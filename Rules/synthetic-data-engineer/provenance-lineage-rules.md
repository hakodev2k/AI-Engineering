# Provenance and Lineage Rules

## Purpose
Make every released synthetic dataset traceable to its inputs, generator, configuration, transformations, validations, and approvals.

## Scope
Applies to source assets, schemas, prompts, models, simulator versions, seeds, post-processing, labels, filters, and derived dataset versions.

## MUST
- Assign immutable identifiers or equivalent traceable versions to released datasets and generator artifacts.
- Record the source categories, generator version, configuration, code revision, randomization inputs, post-processing steps, and validation results used for each release.
- Preserve lineage across derived datasets, subsets, filtered variants, and relabeled outputs.
- Make it possible to identify which downstream releases may be affected when a source, generator, or validation defect is discovered.
- Keep lineage metadata separate from sensitive source content when broad consumers do not require that content.

## MUST NOT
- Publish a dataset whose generation path cannot be reconstructed to a reviewable level.
- Overwrite released dataset versions in place.
- Strip lineage metadata merely to reduce storage or packaging complexity.
- Record secrets, credentials, or unnecessary personal data in provenance metadata.

## SHOULD
- Use machine-readable manifests and content hashes where practical.
- Link evaluation reports and approvals to the exact dataset version they cover.
- Automate lineage capture in generation pipelines rather than relying on manual notes.

## Exceptions
Missing historical lineage must be disclosed, risk-assessed, and corrected before the dataset is reused for high-impact purposes.

## Verification
Inspect manifests, hashes, version records, source references, transformation graphs, evaluation links, and the ability to trace a sampled record or dataset release back through its generation chain.