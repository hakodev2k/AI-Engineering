# Temporal Training Pipelines

## Purpose
Build reproducible, leakage-safe training pipelines that reconstruct historical information state, validate temporal data, and produce traceable time-series model artifacts.

## When to use
Use when moving experiments into scheduled or production training, adding backfills, changing temporal features, or making retraining repeatable across environments.

## Inputs
- Raw temporal data sources
- Event and ingestion timestamps
- Feature definitions
- Training and validation cutoffs
- Model configuration
- Compute environment
- Artifact and model registry conventions

## Preconditions
The target, prediction cutoff, horizon, entity keys, and timestamp semantics must be defined. Training must not rely on information unavailable at the corresponding historical prediction time.

## Context to inspect
Inspect source revision behavior, late-arriving data, schema evolution, backfill semantics, feature materialization, orchestration retries, data retention, dependency versions, credentials boundaries, and artifact storage.

## Core knowledge
A production temporal pipeline must control both data version and information time. Idempotency, deterministic cutoff logic, data lineage, reproducible environments, and explicit artifact versioning matter as much as model code. A successful job is not proof that the generated model is valid.

## Procedure
1. Define immutable run inputs: data snapshot/as-of cutoff, code version, configuration, and dependency environment.
2. Validate schema, entity keys, timestamp ranges, cadence, duplicate rules, and target availability before feature generation.
3. Reconstruct as-of source values when revisions or publication delays exist.
4. Generate features with explicit cutoff-aware joins and window boundaries.
5. Assert that every training row obeys feature-availability constraints.
6. Create temporal train/validation/test partitions deterministically from configuration.
7. Fit preprocessing only on the training portion of each applicable split.
8. Train the model with controlled seeds and resource limits where feasible.
9. Produce baseline and candidate evaluations using the same pipeline outputs.
10. Persist model weights, preprocessing, feature schema, cutoff metadata, metrics, and environment information together.
11. Register artifacts only after required validation gates pass.
12. Make orchestration retries idempotent and avoid duplicate artifact publication.
13. Handle backfills as explicit runs with documented historical cutoffs rather than silently mutating earlier outputs.
14. Emit structured logs and metrics for row counts, missingness, training duration, failures, and artifact identifiers.
15. Test recovery from interrupted jobs and unavailable upstream dependencies.
16. Periodically reproduce a historical run from retained inputs to validate lineage.

## Decision points
- Use immutable snapshots when source history mutates materially; use versioned as-of queries when the platform reliably supports them.
- Cache expensive features only when cache keys include all temporal cutoff and transformation dependencies.
- Separate training and registration/deployment stages when approval or validation gates differ.

## Common failure patterns
- Rebuilding old training sets from revised data without acknowledging the change.
- Fitting normalization before temporal splitting.
- Retry logic publishing multiple model versions.
- Cache keys that omit the forecast cutoff.
- Artifacts missing feature or preprocessing versions.
- Treating pipeline completion as model verification.

## Verification
Implementation is verified operationally when jobs are repeatable, idempotent, and artifacts are traceable. Model validity is verified separately by leakage assertions, temporal backtests, baseline comparisons, schema checks, and reproduction of a retained historical run.

## Expected output
A deterministic training workflow that produces fully versioned temporal datasets, evaluation evidence, and deployment-ready model artifacts with lineage.

## Stop conditions
Stop and escalate if as-of history cannot be reconstructed credibly, required data access is unavailable, destructive backfills are requested without approval, artifact lineage cannot be preserved, or temporal leakage assertions fail.