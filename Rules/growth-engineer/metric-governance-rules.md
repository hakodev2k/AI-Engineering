# Metric Governance Rules

## Purpose
Prevent growth decisions from being driven by ambiguous, unstable, or misleading metrics.

## Scope
North-star metrics, funnel metrics, experiment metrics, dashboards, and KPI definitions.

## MUST
- Define every decision-critical metric with population, event/source, formula, time window, exclusions, and owner.
- Version material metric-definition changes and assess historical comparability.
- Pair optimization metrics with guardrails for quality, retention, reliability, abuse, or customer harm where relevant.

## MUST NOT
- Present proxy metrics as business outcomes without stating the limitation.
- Combine incompatible populations or time windows to support a conclusion.

## SHOULD
- Maintain one authoritative definition for each shared metric and reconcile duplicate implementations.

## Exceptions
Exploratory metrics may be provisional when clearly labeled and excluded from irreversible decisions.

## Verification
Compare dashboard/query definitions with the metric contract, source data, sample records, and historical baselines.