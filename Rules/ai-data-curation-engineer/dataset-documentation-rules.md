# Dataset Documentation Rules
## Purpose
Make dataset intent, composition, limitations, and safe use understandable to downstream users.
## Scope
Dataset cards, manifests, release notes, usage guidance, and limitations.
## MUST
- Every released dataset MUST document purpose, sources, composition, collection and curation methods, labels, splits, known limitations, sensitive-data considerations, and intended or prohibited uses.
- Material caveats MUST be visible to model developers and evaluators.
- Documentation MUST match the released version.
## MUST NOT
- Known limitations MUST NOT be omitted because they reduce perceived dataset quality.
- Documentation MUST NOT claim representativeness or cleanliness without supporting evidence.
## SHOULD
- Documentation SHOULD include quality metrics and known failure modes by important cohorts.
## Exceptions
Exceptions require documented reason and owner approval.
## Verification
Compare documentation with manifests, quality reports, lineage, schemas, and sampled records.