# Production Monitoring and Retraining

## Purpose
Operate time-series models safely after deployment by monitoring data freshness, prediction quality, uncertainty, drift, and business impact, then retraining only when evidence justifies it.

## When to use
Use when defining production dashboards, alerts, retraining policies, model refresh schedules, challenger evaluation, or response to gradual degradation.

## Inputs
- Production predictions and metadata
- Realized targets when available
- Feature and covariate freshness signals
- Baseline and incumbent forecasts
- Model/version history
- Service-level and business metrics
- Retraining and approval constraints

## Context to inspect
Inspect label delay, seasonality, entity mix, forecast horizon, target revisions, upstream data SLAs, interval/quantile outputs, retraining cadence, deployment mechanism, and rollback process.

## Core knowledge
Time-series monitoring needs both leading and lagging indicators. Data freshness, missingness, prediction distributions, and service health are available immediately; forecast error and calibration arrive only after targets mature. Retraining on a fixed schedule can be appropriate for predictable change, while event-driven retraining requires persistence controls and robust validation. A new model should beat both incumbent and naive baselines on representative recent windows before promotion.

## Procedure
1. Define model-health objectives separately from serving-health objectives.
2. Monitor prediction availability, latency, failure rate, cutoff correctness, and stale-output rate.
3. Monitor input freshness, missingness, cadence, schema, entity coverage, and key feature distributions.
4. Track prediction distributions and extreme-value rates before labels arrive.
5. Once labels mature, compute primary error metrics by horizon, entity, segment, and time window.
6. Track forecast bias separately from absolute error to detect systematic over- or under-prediction.
7. For probabilistic models, monitor interval coverage, width, quantile calibration, and tail behavior.
8. Compare production performance continuously with naive and incumbent baselines.
9. Detect sustained drift or regime change using multiple signals rather than one threshold.
10. Define retraining eligibility using minimum data volume, persistence, and performance deterioration criteria.
11. Rebuild candidates through the same leakage-safe temporal training pipeline.
12. Evaluate challengers on recent rolling-origin windows plus stable historical regimes.
13. Require release gates for accuracy, calibration, latency, reliability, and business constraints.
14. Promote through staged rollout where impact warrants it and retain immediate rollback capability.
15. Record why retraining was triggered, which data window was used, and why a candidate was promoted or rejected.
16. Review alert thresholds periodically to control noise and avoid retraining loops.

## Decision points
- Use scheduled retraining when data accumulates predictably and model decay is gradual.
- Use event-triggered retraining when shifts can occur abruptly and reliable monitoring evidence exists.
- Do not retrain automatically for serving incidents or upstream data corruption; fix the system first.
- Prefer keeping the incumbent when the challenger gain is within backtest variance or introduces material operational risk.

## Common failure patterns
- Alerting only on aggregate error and missing critical entity or horizon regressions.
- Retraining on corrupted or incomplete recent data.
- Using immature labels to judge forecasts.
- Promoting every newly trained model without incumbent comparison.
- Automatic retraining loops caused by noisy drift alarms.
- Ignoring prediction interval calibration after deployment.
- Losing model/data lineage across refreshes.

## Verification
Verify dashboards and alerts using injected failures and historical incidents, confirm label-maturity logic, reproduce production metrics independently, test candidate-versus-incumbent gates, and exercise rollback before enabling automated promotion.

## Expected output
A production monitoring and retraining policy with leading/lagging indicators, alert thresholds, evaluation windows, challenger gates, promotion rules, lineage, and rollback procedures.

## Stop conditions
Stop and escalate if target labels are unreliable, recent data may be corrupted, retraining would use an unverified temporal window, model promotion lacks rollback, or automated decisions would exceed approved operational authority.