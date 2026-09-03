# Training Data Integrity Rules

## Purpose
Prevent unauthorized or undetected manipulation of data that can alter learned model behavior.

## Scope
Applies to raw sources, labels, transformations, feature generation, sampling, and training datasets.

## MUST
- Validate source identity, expected schema, volume, and integrity before training data is admitted.
- Preserve traceability from training examples to approved sources and transformation versions where practical.
- Detect unexpected distribution, label, duplication, and source changes before model promotion.
- Restrict write access to authoritative training datasets using least privilege.

## MUST NOT
- Train production candidates on unexplained or untraceable data additions.
- Allow silent mutation of immutable training snapshots used for released models.
- Treat checksum validation alone as proof that data is trustworthy.

## SHOULD
- Use signed manifests or equivalent integrity controls for high-risk datasets.
- Separate ingestion permissions from model-promotion permissions.

## Exceptions
Emergency data corrections require documented scope, evidence, impact assessment, reproducible rebuild, and approval.

## Verification
Inspect dataset manifests, access controls, provenance records, anomaly reports, transformation hashes, and reproducibility tests.