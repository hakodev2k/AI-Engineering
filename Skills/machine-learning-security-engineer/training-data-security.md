# Training Data Security

## Purpose
Protect training and fine-tuning datasets from unauthorized modification, contamination, leakage, and provenance loss while preserving reproducibility.

## When to use
Use when onboarding datasets, changing ingestion pipelines, granting data access, investigating suspicious model behavior, or preparing regulated/sensitive training runs.

## Inputs
Dataset sources, schemas, lineage, storage controls, ingestion code, access policies, checksums, labeling process, and quality/security baselines.

## Preconditions
Identify dataset owners, permitted uses, retention constraints, and authoritative sources.

## Context to inspect
Review collection, transfer, staging, transformation, labeling, versioning, training snapshots, caches, backups, and deletion workflows.

## Core knowledge
Training integrity depends on provenance and controlled mutation. Poisoning may be targeted or broad; compromised labels, duplicate contamination, hidden triggers, and untrusted archives can alter model behavior. Confidential datasets also create privacy and exfiltration risk.

## Procedure
1. Classify data by sensitivity and trust level.
2. Establish source identity and provenance evidence.
3. Pin immutable dataset versions and cryptographic digests where practical.
4. Validate formats and safely unpack external archives.
5. Scan for anomalous distributions, duplicates, label shifts, and suspicious samples.
6. Separate trusted baseline data from untrusted additions.
7. Apply least-privilege write access and immutable audit logs.
8. Require review for material dataset mutations.
9. Test targeted subsets for poisoning indicators relevant to the model task.
10. Record transformations and code versions used to derive training snapshots.
11. Define quarantine and rollback procedures.
12. Revalidate provenance before training promotion.

## Decision points
Use stronger human review for high-impact labels or weakly trusted sources. Prefer immutable snapshots for reproducibility; use mutable working datasets only before promotion. Reject data when provenance cannot support the intended risk level.

## Common failure patterns
Shared writable buckets, undocumented manual edits, trusting file extensions, training directly from mutable sources, no lineage between raw and transformed data, weak separation between experiment and production datasets.

## Verification
Reconstruct a training snapshot from recorded lineage; verify unauthorized writers cannot mutate promoted data; compare hashes and sample counts; confirm quarantined inputs cannot reach training.

## Expected output
A controlled, versioned dataset with provenance, integrity evidence, access boundaries, anomaly findings, and rollback instructions.

## Stop conditions
Stop when provenance is materially missing, legal use is unclear, unexplained integrity changes appear, or remediation would destroy evidence needed for investigation.