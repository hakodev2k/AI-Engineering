# Data Validation Pipeline Gates

## Purpose
Implement automated quality gates that stop invalid AI data from reaching training, evaluation, or serving systems.

## When to use
Use in ingestion pipelines, feature generation, dataset publishing, training workflows, and release processes.

## Inputs
Quality requirements, schemas, historical baselines, pipeline stages, failure policies, ownership and alerting rules.

## Preconditions
Checks have explicit thresholds and expected response behavior.

## Context to inspect
Orchestrator, CI/CD, dataset registry, feature pipelines, retry behavior, quarantine storage, notification channels, downstream dependencies.

## Core knowledge
A quality gate should distinguish hard invariants, warning thresholds, and statistical anomalies. Blocking every deviation causes alert fatigue and pipeline paralysis; allowing every warning makes gates ceremonial.

## Procedure
1. Place checks at the earliest reliable boundary.
2. Separate structural, semantic, statistical, and freshness checks.
3. Define block, quarantine, warn, and observe outcomes.
4. Ensure failures include actionable evidence.
5. Prevent retries from repeatedly publishing bad data.
6. Preserve failed samples for diagnosis.
7. Add owner and escalation metadata.
8. Test gates with intentionally invalid datasets.
9. Measure false-positive and false-negative behavior.
10. Review thresholds as distributions evolve.

## Decision points
Block deterministic contract violations; quarantine uncertain batches when safe; warn for low-risk statistical shifts pending trend confirmation.

## Common failure patterns
Checks only after data publication, generic failure messages, no quarantine path, endless retries, and thresholds copied between unrelated datasets.

## Verification
Known bad fixtures are rejected, valid fixtures pass, and downstream consumers never observe blocked data.

## Expected output
A tested validation gate with explicit failure modes and operational ownership.

## Stop conditions
Stop when no safe quarantine or rollback path exists for a blocking rule.