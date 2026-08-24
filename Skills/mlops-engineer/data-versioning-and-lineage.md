# Data Versioning and Lineage

## Purpose
Establish reliable lineage from model behavior back to source data, transformations, labels, schemas, and quality checks.

## When to use
Use for training datasets, evaluation sets, feature pipelines, backfills, incident analysis, and model audits.

## Inputs
Source systems, schemas, transformation code, dataset manifests, partitioning, label provenance, retention constraints.

## Preconditions
Sources expose stable identifiers or can be fingerprinted.

## Context to inspect
ETL/ELT jobs, object stores, warehouses, catalogs, feature pipelines, access controls, and deletion policies.

## Core knowledge
A dataset version must represent content and transformation provenance, not merely a path or date. Lineage must survive recomputation and support impact analysis.

## Procedure
1. Identify authoritative sources and owners.
2. Define immutable dataset/version identifiers.
3. Capture schema and transformation versions.
4. Record partition and sampling rules.
5. Track label generation and human-review provenance.
6. Attach data-quality evidence.
7. Link datasets to experiments and registered models.
8. Define retention and deletion propagation.
9. Test backward lineage from a production model.
10. Test forward impact from a changed source.

## Decision points
Snapshot vs delta/version log; physical copies vs manifests; row-level lineage only where risk justifies cost.

## Common failure patterns
Date-named mutable folders, undocumented filters, lost label provenance, train/test overlap, stale catalog metadata, and privacy deletion not reaching derived artifacts.

## Verification
Resolve any promoted model to exact data inputs and transformations, and identify affected models from a source change.

## Expected output
Versioning convention, lineage graph, data contract links, retention rules, and impact-analysis procedure.

## Stop conditions
Escalate when source ownership is unknown, legal deletion cannot be propagated, or lineage gaps invalidate model evidence.