# Source Data Governance Rules

## Purpose
Control how real, reference, seed, and calibration data may influence synthetic-data generation.

## Scope
Applies whenever generation uses production data, samples, statistics, embeddings, templates, schemas, logs, annotations, or externally licensed datasets.

## MUST
- Confirm legal, contractual, privacy, and organizational permission before using source data for synthesis, calibration, or evaluation.
- Classify source data by sensitivity and apply handling controls before ingestion.
- Minimize source-data access to the fields, records, and retention period necessary for the approved generation purpose.
- Record source provenance, ownership, permitted use, and transformation history.
- Separate raw sensitive source data from generated outputs and from lower-trust processing environments.
- Validate that externally sourced data licenses permit the intended generation and downstream distribution model.

## MUST NOT
- Assume synthetic transformation automatically removes licensing, privacy, or confidentiality obligations.
- Copy production data into ad hoc notebooks, local folders, or unmanaged stores to accelerate generation.
- Use unapproved customer, employee, health, financial, biometric, or other sensitive data as seed material.
- Retain source extracts indefinitely after the approved generation or validation purpose ends.

## SHOULD
- Prefer approved aggregates, schemas, distributions, or privacy-preserving summaries when full records are unnecessary.
- Use least-privilege identities and short-lived access for generation jobs.
- Maintain machine-readable lineage linking source assets to generated versions.

## Exceptions
An exception must identify the data owner, legal basis, sensitivity, retention, compensating controls, and approving authority. Convenience is not a valid justification.

## Verification
Inspect access logs, data catalog metadata, license records, source manifests, retention settings, storage boundaries, and lineage records. Security or privacy reviewers SHOULD independently verify high-risk source usage.