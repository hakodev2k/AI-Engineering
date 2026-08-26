# Training Data Governance

## Purpose
Maintain provenance, rights, policy, retention, and reproducibility controls for datasets used in model training.

## When to use
Use whenever data is acquired, transformed, merged, released to training, or removed from future training.

## Inputs
Source metadata, licenses/terms, collection dates, processing lineage, policy classifications, dataset manifests, removal requests.

## Context to inspect
Origin, permitted uses, geographic/privacy constraints, PII handling, retention, derivative datasets, downstream snapshots, and access controls.

## Core knowledge
A technically high-quality dataset may still be unusable. Governance must survive transformations: filtered, deduplicated and tokenized derivatives need lineage back to sources. Reproducibility and deletion obligations can conflict unless designed together.

## Procedure
1. Register each source with provenance and permitted-use metadata.
2. Assign stable dataset/source identifiers.
3. Record every transformation and output manifest.
4. Enforce access according to classification.
5. Integrate policy checks before mixture inclusion.
6. Track source-to-shard lineage through filtering/deduplication.
7. Define retention and deletion procedures.
8. Test whether affected derivatives can be identified.
9. Version approvals with corpus releases.
10. Audit training manifests against approved sources.

## Decision points
Quarantine uncertain sources rather than assuming permission. Retain only metadata necessary for audit when raw retention is restricted. Escalate legal/policy interpretation instead of encoding guesses in pipeline logic.

## Common failure patterns
Losing lineage after deduplication; spreadsheet-only approvals; mixing approved and unapproved snapshots; no deletion propagation; credentials embedded in manifests.

## Verification
Given a training shard, trace it to approved sources; given a source, identify affected corpus versions. Access and deletion workflows are tested.

## Expected output
Auditable dataset registry, lineage manifests, approval gates, and retention/removal procedures.

## Stop conditions
Stop data release for unresolved rights, prohibited content handling, missing lineage, or inability to satisfy required removal controls.