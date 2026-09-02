# AI Alert Engineering

## Purpose
Create high-signal alerts for AI systems that identify urgent user impact without paging on harmless model or traffic variation.

## When to use
Use when creating or reviewing production alerts, reducing alert fatigue, or operationalizing SLOs.

## Inputs
SLOs, metrics, incident history, traffic volumes, on-call model, dependency behavior, and deployment events.

## Context to inspect
Inspect current pages, false positives, provider rate limits, model routing, retries, quality signals, queue saturation, and runbooks.

## Core knowledge
Pages should represent urgent actionable impact. AI workloads are variable, so minimum sample sizes, ratios, burn rates, and cohort-aware thresholds are safer than raw counts. Quality proxies often belong in tickets or investigation queues rather than immediate pages.

## Procedure
1. Classify signals into page, ticket, dashboard, or experiment guardrail.
2. Anchor pages to user-visible SLO burn, sustained failure, or capacity exhaustion.
3. Add minimum traffic and duration conditions.
4. Alert separately for throttling, provider outage, queue saturation, and severe cost anomalies when actions differ.
5. Route alerts to a clear owner and attach diagnostic links.
6. Test alert logic against historical incidents and quiet periods.
7. Define suppression behavior during known maintenance without hiding unrelated failures.
8. Review noisy alerts and either improve or remove them.

## Decision points
Page for urgent intervention; ticket for slow drift. Prefer multi-window burn alerts for SLOs and anomaly detection only where baselines are stable.

## Common failure patterns
Paging on every provider error, static thresholds without traffic normalization, alerts without owners, quality-proxy paging, and dashboards mislabeled as alerts.

## Verification
Replay historical incident windows and prove the alert fires early enough while representative normal periods remain quiet.

## Expected output
Actionable alert rules, severity/routing policy, runbook links, and validation evidence.

## Stop conditions
Stop if there is no defined responder action or insufficient historical data makes a complex anomaly detector unjustifiable.