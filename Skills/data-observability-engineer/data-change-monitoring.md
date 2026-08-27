# Data Change Monitoring

## Purpose
Detect and correlate code, configuration, schema, source, and infrastructure changes with shifts in data behavior and reliability.

## When to use
Use when deployments or source changes frequently precede incidents, or when teams need faster attribution of regressions.

## Inputs
Deployment events, schema changes, configuration history, source release notes, pipeline versions, data metrics, incident timelines.

## Preconditions
Changes must carry stable timestamps and identifiers that can be correlated with data telemetry.

## Context to inspect
Inspect source systems, repositories, orchestration configuration, warehouse DDL, feature flags, infrastructure changes, and ownership metadata.

## Core knowledge
Change correlation is evidence, not proof of causation. Senior engineers use temporal proximity plus lineage and reproduction to prioritize hypotheses while avoiding simplistic blame on the latest deployment.

## Procedure
1. Enumerate change sources that can affect critical data products.
2. Emit normalized change events with actor, time, scope, and version.
3. Map changes to affected pipelines and datasets using lineage.
4. Overlay change events on freshness, quality, volume, and execution telemetry.
5. Flag material deviations following relevant changes.
6. Rank candidate changes by directness and blast radius.
7. Link incidents to verified causal changes after investigation.
8. Measure which change classes repeatedly cause regressions.
9. Strengthen pre-deployment checks for high-risk classes.

## Decision points
Automate correlation broadly, but automate rollback only when causality and rollback safety are strong. Include external source changes where possible; otherwise mark attribution confidence explicitly.

## Common failure patterns
- Assuming newest deployment caused the incident
- No visibility into configuration changes
- Missing source-side change history
- Alerting on harmless changes
- No lineage-based scoping

## Verification
Replay known incidents and confirm relevant changes surface without drowning responders in unrelated activity.

## Expected output
Normalized change telemetry, lineage-aware correlation, and evidence links for incident diagnosis.

## Stop conditions
Escalate when change records are incomplete enough to make automated attribution misleading.