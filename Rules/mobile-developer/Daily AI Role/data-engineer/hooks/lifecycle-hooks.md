# Lifecycle Hooks

Hooks are tool-neutral trigger specifications.

## pre-contract-change
Run contract schema validation and lineage-impact review. Fail closed on malformed contract or unknown owner.

## pre-production-pipeline-change
Check approval gates, test evidence, replay/rollback plan, monitoring and affected datasets. Idempotent: repeated evaluation yields the same result for unchanged inputs.

## post-pipeline-run
Record run ID, partitions, source watermark, output watermark, row counts, rejected rows, quality results, duration and cost when available.

## on-quality-failure
Classify deterministic vs transient. Quarantine/contain according to contract; do not retry deterministic invalid data blindly.

## on-schema-drift
Stop incompatible writes when policy requires, preserve sample/evidence without exposing sensitive payloads, and open schema-change workflow.

## on-meaningful-failure
Create a failure-learning record after recovery; do not modify process from a single unexplained anomaly.
