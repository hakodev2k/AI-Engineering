# Data Quality Requirements

## Purpose
Define measurable data quality expectations for AI and machine-learning workloads.

## When to use
Use before onboarding a dataset, changing a source, or setting release gates for training and inference data.

## Inputs
Use case, schema, source description, refresh cadence, downstream consumers, model requirements, known failure cases.

## Preconditions
The intended downstream use is understood.

## Context to inspect
Source ownership, ingestion path, training path, inference path, critical fields, refresh schedule, existing checks, and consumer expectations.

## Core knowledge
Data quality is contextual. Completeness, validity, uniqueness, freshness, consistency, representativeness, and label correctness matter differently by workload. Thresholds should reflect downstream risk and model sensitivity.

## Procedure
1. Identify data consumers and decisions influenced by the data.
2. List critical fields, entities, labels, and relationships.
3. Map likely failures to measurable quality dimensions.
4. Define thresholds and warning bands.
5. Separate deterministic invariants from statistical expectations.
6. Define freshness requirements.
7. Define subgroup coverage requirements when relevant.
8. Assign ownership for each quality rule.
9. Specify alerting and release-gate behavior.
10. Review requirements with data and ML stakeholders.

## Decision points
Use blocking checks for hard invariants and monitoring for noisy statistical properties. Tighten requirements when downstream consequences are difficult to reverse.

## Common failure patterns
Generic quality scores, undocumented thresholds, checks unrelated to model sensitivity, and missing ownership.

## Verification
Each requirement is measurable, testable, owned, and tied to a downstream risk or acceptance criterion.

## Expected output
A prioritized data quality specification with metrics, thresholds, owners, and enforcement behavior.

## Stop conditions
Stop and escalate when product semantics or source guarantees are too ambiguous to define a defensible rule.