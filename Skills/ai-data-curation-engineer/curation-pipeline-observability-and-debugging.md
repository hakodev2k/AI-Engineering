# Curation Pipeline Observability and Debugging

## Purpose
Detect and diagnose silent data loss, source drift, schema breakage, filter regressions, throughput failures, and quality shifts across large AI data-curation pipelines.

## When to use
Use when operating recurring ingestion or curation jobs, investigating unexpected dataset-size or quality changes, onboarding volatile sources, or validating a new transformation stage.

## Inputs
- Pipeline topology and stage contracts
- Logs, metrics, and job status
- Source and output manifests
- Rejection reasons and quality scores
- Known-good historical release
- Representative traceable examples

## Context to inspect
Inspect stage boundaries, retry behavior, checkpoints, queue or batch semantics, source-specific parsers, schema versions, rejection thresholds, resource saturation, storage errors, privacy constraints on logging, and recent code/configuration changes.

## Core knowledge
A successful job does not imply a correct dataset. Data pipelines need semantic observability: record and byte/token counts, distributions, rejection ratios, null/schema violations, duplicate rates, source mix, quality-score shifts, and sample lineage. Raw sensitive content should not be copied into logs merely to improve debugging.

## Procedure
1. Define input/output contracts and invariants for every stage.
2. Instrument counts, sizes, latency, error rates, rejection reasons, and key distributions by source and slice.
3. Attach stable trace or lineage identifiers that allow bounded examples to be followed through stages.
4. Establish baselines and expected ranges from known-good releases.
5. Alert on material distribution shifts as well as execution failures.
6. When an anomaly occurs, identify the first stage where observed output diverges from its contract or historical baseline.
7. Compare recent code, configuration, source format, and dependency changes.
8. Replay a bounded representative sample through the suspected stage.
9. Distinguish bad input, parser failure, policy rejection, transformation bug, and infrastructure failure.
10. Fix the narrowest root cause with a versioned change.
11. Reprocess only affected data when lineage makes the scope reliable; otherwise rebuild from the last trustworthy boundary.
12. Verify repaired distributions and record a post-incident explanation for material dataset changes.

## Decision points
Fail closed when schema, rights, privacy, or contamination checks cannot execute safely. Quarantine instead of dropping data when recoverable source defects are ambiguous. Retry transient infrastructure failures, but do not endlessly retry deterministic bad records.

## Common failure patterns
- Monitoring only whether the workflow completed
- Looking at global averages that hide one broken source
- Logging raw PII to diagnose rejected examples
- Retrying corrupt records indefinitely
- Changing a filter threshold to restore volume without investigating quality
- Reprocessing entire corpora when lineage could bound the affected set
- Failing to compare against a known-good release

## Verification
Implemented means each critical stage emits actionable operational and semantic telemetry. Verified means injected or historical failure scenarios are detected, sample traces identify the responsible stage, repaired runs return to expected distributions, and sensitive-content logging controls remain intact.

## Expected output
An observable curation pipeline with stage contracts, dashboards or metrics, anomaly thresholds, traceable samples, root-cause evidence, bounded remediation scope, and post-fix validation.

## Stop conditions
Stop and escalate when remediation would destructively alter an approved release, raw inputs needed for replay are unavailable, production or restricted-data access is required but not granted, or evidence does not isolate the failure sufficiently for a safe correction.