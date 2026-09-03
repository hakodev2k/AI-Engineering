# Dataset Provenance Rules

## Purpose
Make security decisions about ML data auditable and reproducible.

## Scope
Applies to acquired, generated, licensed, public, synthetic, and internally collected datasets.

## MUST
- Record source, acquisition method, owner, applicable usage constraints, transformation lineage, and approval status for production training data.
- Preserve provenance metadata across filtering, joins, augmentation, and derived datasets.
- Identify externally supplied or weakly controlled sources as distinct trust domains.
- Retain enough evidence to reproduce the dataset version associated with a released model.

## MUST NOT
- Represent unknown-origin data as verified.
- Collapse distinct source histories in a way that prevents incident scoping or removal.
- Delete lineage evidence required for active model investigations without approved retention handling.

## SHOULD
- Automate lineage capture and immutable dataset versioning.
- Track source confidence and integrity controls proportionate to model risk.

## Exceptions
Legacy datasets without full lineage require a documented gap assessment, compensating controls, and explicit acceptance before continued use.

## Verification
Review provenance records, dataset manifests, transformation lineage, approvals, and rebuild evidence.