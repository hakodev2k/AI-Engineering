# Production Quality Monitoring

## Purpose
Use production signals as part of the quality feedback loop to detect escaped failures and validate real-world behavior.

## When to use
Use for release validation, progressive delivery, critical journeys, and quality trend analysis.

## Inputs
SLOs, telemetry, logs, traces, business events, deployment metadata, support signals.

## Context to inspect
Inspect observability coverage, alert thresholds, user journeys, deployment markers, privacy constraints, and incident workflows.

## Core knowledge
Pre-production tests cannot reproduce every workload and dependency condition. Production quality monitoring should focus on user outcomes, errors, latency, correctness proxies, and regressions—not merely host health.

## Procedure
1. Define critical production quality signals.
2. Link signals to user journeys and releases.
3. Establish baselines and meaningful thresholds.
4. Segment by version, region, tenant, or feature where useful.
5. Configure actionable alerts with ownership.
6. Validate signals during progressive rollout.
7. Correlate support/incident reports with telemetry.
8. Convert escaped defects into regression prevention.
9. Review blind spots after incidents.

## Decision points
Alert on symptoms requiring action; use dashboards rather than paging for informational trends.

## Common failure patterns
Infrastructure-only dashboards, noisy alerts, no deployment correlation, collecting data without ownership, and logging sensitive information.

## Verification
Inject or identify known failure signals and confirm detection, routing, and diagnostic usefulness.

## Expected output
A production quality signal set integrated with release and incident workflows.

## Stop conditions
Escalate when monitoring requires prohibited personal data or production access exceeds authorization.