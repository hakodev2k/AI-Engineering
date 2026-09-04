# Data Classification Rules

## Purpose
Ensure personal and sensitive data is classified consistently so controls match actual risk.

## Scope
Applies to raw data, derived data, metadata, logs, backups, analytics datasets, exports, and model inputs or outputs containing information about people.

## MUST
- Data categories MUST be classified before they are introduced into persistent storage or production data flows.
- Classification MUST consider identifiability, sensitivity, contractual restrictions, regulatory treatment, business impact, and re-identification risk.
- Derived fields MUST be classified based on what they reveal, not only on the sensitivity of source fields.
- Classification changes MUST trigger review of access, retention, encryption, logging, export, and deletion controls.

## MUST NOT
- Data MUST NOT be classified as non-personal merely because direct identifiers were removed.
- Unknown or unreviewed datasets MUST NOT default to the least restrictive category.
- Classification metadata MUST NOT be stripped when data is copied between systems without an approved replacement control.

## SHOULD
- Classification SHOULD be machine-readable where practical and propagated through schemas, catalogs, and pipelines.
- High-risk categories SHOULD have stronger default controls than ordinary personal data.

## Exceptions
Any downgrade requires evidence showing reduced identifiability or sensitivity, documented risk analysis, and accountable approval.

## Verification
Inspect schemas, catalogs, metadata tags, data-flow inventories, retention rules, IAM policies, and sample records. Verify classification decisions remain aligned with actual data content and derived attributes.