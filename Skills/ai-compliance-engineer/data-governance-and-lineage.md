# Data Governance and Lineage

## Purpose
Ensure AI training, evaluation, retrieval, and production data are traceable, authorized, appropriately governed, and usable for compliance evidence.

## When to use
Use for model development, RAG systems, fine-tuning, data-source onboarding, audits, data incidents, or material dataset changes.

## Inputs
Dataset inventory, source systems, licenses, consent or legal basis, classification, lineage metadata, retention rules, access controls.

## Preconditions
Major data sources and processing stages are discoverable.

## Context to inspect
Data catalog, ingestion jobs, feature stores, vector stores, annotation pipelines, evaluation datasets, deletion workflows, provider data handling.

## Core knowledge
AI compliance depends on provenance: where data came from, why it may be used, how it was transformed, who can access it, where it is sent, and whether deletion or correction propagates. Derived artifacts can retain sensitive or restricted information.

## Procedure
1. Inventory data sources and purposes.
2. Record provenance and acquisition terms.
3. Classify sensitive and regulated data.
4. Map transformations and derived datasets.
5. Verify access and segregation controls.
6. Confirm retention and deletion behavior.
7. Track dataset and index versions.
8. Record quality and representativeness concerns.
9. Link data assets to models and systems using them.
10. Define evidence and periodic review.

## Decision points
Exclude data when provenance or usage rights cannot be established. Use stricter controls for sensitive, cross-border, or high-impact datasets.

## Common failure patterns
Lineage stopping at the source table, ignoring embeddings and caches, undocumented web-scraped data, deletion not propagating, and mixing evaluation data with training data.

## Verification
Trace sample records from source through processing to AI use and confirm authorization, access, version, and deletion paths.

## Expected output
A data-lineage record with provenance, purpose, transformations, classifications, controls, and system dependencies.

## Stop conditions
Escalate when rights to use data are unclear, required deletions cannot propagate, or restricted data crosses unauthorized boundaries.