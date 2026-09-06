# Lineage and Provenance Rules

## Purpose
Make every registered model traceable to the code, data, configuration, evaluation evidence, and process that produced it.

## Scope
Training runs, source code revisions, datasets, feature definitions, parameters, environments, evaluation runs, approvals, and deployments.

## MUST
- Every governed model version MUST link to its producing training run or equivalent immutable provenance record.
- Provenance MUST identify training code revision, data or dataset version, material configuration, and model artifact digest where available.
- Evaluation and approval records MUST reference the exact immutable model version they assessed.
- Deployment records MUST identify the exact registered model version promoted.
- Lineage required for incident, compliance, or reproducibility purposes MUST be retained for the applicable lifecycle period.

## MUST NOT
- A model MUST NOT be marked reproducible when required source data, code, configuration, or environment references are unavailable.
- Provenance MUST NOT be reconstructed solely from naming conventions when deterministic identifiers can be captured.
- Historical lineage MUST NOT be rewritten to hide superseded or failed states.

## SHOULD
- Capture lineage automatically from training, evaluation, registry, and deployment systems.
- Prefer immutable run IDs, commit SHAs, dataset snapshots, and artifact digests.

## Exceptions
Manual provenance is allowed only when automation is unavailable, with documented gaps and remediation ownership.

## Verification
Trace sampled production models from deployment back through registry version, evaluation, training run, code revision, and data references.