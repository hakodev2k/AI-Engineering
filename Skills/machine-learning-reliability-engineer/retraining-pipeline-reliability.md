# Retraining Pipeline Reliability

## Purpose
Design retraining workflows that are repeatable, observable, idempotent, and safe to retry without silently promoting bad models.

## When to use
Use for scheduled, event-driven, or manually triggered retraining pipelines and when recurring failures or partial reruns threaten model integrity.

## Inputs
- Training workflow definition
- Dataset and feature dependencies
- Model evaluation gates
- Artifact registry
- Scheduler/orchestrator behavior
- Retry and timeout policies

## Context to inspect
Inspect pipeline stages, dependency freshness, checkpoint behavior, artifact naming, distributed job retries, resource quotas, promotion logic, and failure notifications.

## Core knowledge
Successful execution does not imply a trustworthy model. Reliable retraining separates data preparation, training, evaluation, registration, and promotion; preserves immutable inputs; and makes retries safe. Promotion must be gated on evidence rather than job exit status.

## Procedure
1. Map every stage and its inputs, outputs, owners, and side effects.
2. Assign immutable run and dataset identifiers.
3. Make stages idempotent or explicitly compensate duplicate side effects.
4. Define bounded retries only for transient failures.
5. Add timeouts and heartbeat detection for stalled jobs.
6. Validate input freshness, completeness, and schema before training.
7. Persist checkpoints where recovery cost justifies them.
8. Evaluate candidate models against fixed acceptance and regression gates.
9. Register artifacts immutably before promotion.
10. Separate successful training from deployment approval.
11. Emit stage-level metrics, logs, lineage, and failure reasons.
12. Test restart from representative failure points.

## Decision points
Retry network and infrastructure transients; fail fast on deterministic data or code errors. Resume from checkpoints only when state compatibility is proven. Require human approval for high-impact model changes when automated gates cannot bound risk sufficiently.

## Common failure patterns
- Retry creates duplicate artifacts or promotions.
- Training proceeds on incomplete data.
- Latest mutable paths hide which input was used.
- Failed evaluation does not block deployment.
- Stalled workers consume resources indefinitely.

## Verification
Inject stage failures, rerun the workflow, and verify deterministic lineage, no duplicated side effects, correct evaluation gating, and complete observability.

## Expected output
A retraining workflow with idempotency rules, bounded retries, quality gates, immutable lineage, and tested recovery paths.

## Stop conditions
Stop automatic promotion when input validation fails, lineage is incomplete, evaluation evidence is missing, or retry behavior is not safe.