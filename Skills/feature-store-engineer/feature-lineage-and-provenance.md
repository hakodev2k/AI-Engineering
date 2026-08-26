# Feature Lineage and Provenance

## Purpose
Make every feature value traceable to source data, transformation version and publication path for debugging, governance and reproducibility.

## When to use
Use when onboarding features, changing pipelines, building audits or investigating incorrect predictions.

## Inputs
Sources, transformations, orchestration metadata, registry entries, dataset/model references and deployment versions.

## Context to inspect
Catalog, DAGs, code commits, table snapshots, job metadata and model lineage.

## Core knowledge
Useful lineage spans source-to-feature-to-dataset-to-model, and distinguishes logical lineage from exact execution provenance.

## Procedure
1. Identify authoritative source datasets and owners.
2. Capture transformation identity/version.
3. Record upstream and downstream dependencies.
4. Attach execution timestamp, source snapshot and output partition/version.
5. Link training datasets to feature versions.
6. Link deployed models to training dataset provenance.
7. Expose lineage in searchable metadata.
8. Test reverse traversal from a prediction/model to sources.
9. Retain provenance for the required audit/reproducibility horizon.

## Decision points
Capture exact snapshot IDs for regulated or reproducibility-critical workflows; logical lineage may suffice for low-risk exploratory features.

## Common failure patterns
Lineage ending at a table, missing code version, overwritten snapshots, stale catalog edges and undocumented manual repair.

## Verification
Select a production model and reconstruct its feature definitions, source snapshots and transformation versions without undocumented assumptions.

## Expected output
Queryable end-to-end feature provenance suitable for RCA and reproducibility.

## Stop conditions
Stop claims of reproducibility when required source snapshots or transformation versions are unavailable.