# Investigate Stale Retrieval

## Purpose
Determine whether a RAG answer can be trusted when retrieved chunks may lag behind the source of truth.

## When to use
Use after source updates, indexing incidents, version mismatches, suspicious old answers, or before high-impact retrieval workflows.

## Inputs
Source metadata, index metadata, retrieval sample, repository configuration, and freshness policy.

## Preconditions
Read-only access to source/index metadata and permission to run `scripts/freshness_gate.py`.

## Allowed tools
Repository search, source metadata APIs, index metadata APIs, logs, Python, and test runners.

## Constraints
Do not alter source data or indexes during investigation. Do not treat missing metadata as fresh.

## Procedure
1. Identify the authoritative source and the index used by the application.
2. Capture source version, source update timestamp, content hash, indexed version, and indexed timestamp for each sampled document.
3. Run `python scripts/freshness_gate.py --policy config/freshness-policy.yaml --input <metadata.json> --output <result.json>`.
4. Classify failures as version mismatch, index lag, source age, hash mismatch, or missing evidence.
5. Trace the ingestion path for stale records and locate the first stage where source and index diverge.
6. Check queue failures, skipped events, dead letters, partial batch failures, clock skew, and retry exhaustion.
7. Record facts separately from hypotheses.
8. Produce a minimal remediation plan; do not reindex yet unless the workflow reaches its approval/execution stage.

## Expected output
A freshness result JSON plus evidence linking each stale document to its source/index metadata and suspected failure stage.

## Verification
Every stale finding must include a reproducible metadata comparison. Unknown state blocks completion.

## Failure handling
Retry metadata reads at most twice for transient failures. Preserve responses and stop on permission, schema, or repeated tool failure.

## Stop conditions
Stop when the stale boundary is isolated, no trustworthy metadata exists, or remediation requires privileged/destructive action.
