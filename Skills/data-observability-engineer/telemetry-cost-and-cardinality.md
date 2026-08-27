# Telemetry Cost and Cardinality

## Purpose
Control observability cost while preserving enough diagnostic resolution to operate data systems effectively.

## When to use
Use when metrics, logs, traces, or metadata growth becomes expensive, slow, or difficult to query; also use during observability architecture design.

## Inputs
Telemetry volumes, cardinality by dimension, retention policies, query usage, incident needs, storage and vendor costs.

## Preconditions
Understand which signals are required for SLO measurement, incident diagnosis, compliance, and capacity planning.

## Context to inspect
Inspect labels and dimensions, log payload size, trace sampling, metadata snapshots, retention tiers, dashboards, alert queries, and rarely used telemetry.

## Core knowledge
High-cardinality dimensions such as record IDs, query IDs, or partition keys can make monitoring systems expensive or unstable. Senior engineers preserve detailed evidence selectively while aggregating routine measurements.

## Procedure
1. Inventory telemetry sources and monthly volume/cost.
2. Identify highest-cardinality dimensions and largest payloads.
3. Classify signals as operationally essential, diagnostic, compliance-required, or low-value.
4. Remove duplicate instrumentation and unused dimensions.
5. Aggregate routine metrics at actionable boundaries.
6. Move high-detail diagnostics to sampled or shorter-retention storage where appropriate.
7. Apply tiered retention based on incident and audit needs.
8. Set budgets and alerts for telemetry growth.
9. Validate that common incident investigations remain possible.
10. Reassess after architecture or workload changes.

## Decision points
Retain fine-grained evidence longer only when regulation or incident requirements justify it. Sample traces and verbose logs before dropping SLO-critical metrics. Prefer bounded dimensions for alerts.

## Common failure patterns
- Using unique IDs as metric labels
- Deleting telemetry without checking incident workflows
- Keeping debug logs indefinitely
- Optimizing cost by removing critical evidence
- No budget for metadata growth

## Verification
Re-run representative incident investigations against the reduced telemetry set and confirm SLO calculations remain exact enough for policy.

## Expected output
A telemetry budget, cardinality controls, retention policy, and validated diagnostic coverage.

## Stop conditions
Escalate before deleting evidence subject to legal, security, audit, or retention requirements.