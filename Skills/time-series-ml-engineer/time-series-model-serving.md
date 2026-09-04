# Time-Series Model Serving

## Purpose
Design reliable serving for time-series models while preserving prediction-cutoff semantics, feature freshness, horizon contracts, and fallback behavior.

## When to use
Use when deploying forecasting, temporal classification, anomaly detection, or sequence models to batch, streaming, or online inference systems.

## Inputs
- Trained model and preprocessing artifacts
- Prediction cadence and horizon
- Feature and covariate contracts
- Latency and throughput requirements
- Entity identifiers and timezone rules
- Deployment and rollback constraints

## Context to inspect
Inspect how prediction requests are triggered, event-time versus processing-time semantics, feature-store freshness, known-future covariates, model state, cache behavior, late data, upstream SLAs, and downstream consumers.

## Core knowledge
Time-series serving differs from ordinary stateless inference because predictions are tied to explicit cutoffs and often depend on historical state. Batch generation, online requests, and streaming inference have different consistency and latency trade-offs. Recursive forecasting can compound errors and state mistakes. A robust system must define what happens when history, covariates, or the primary model are unavailable.

## Procedure
1. Define the serving contract: prediction cutoff, entity, horizon, output units, timezone, and model version.
2. Choose batch, online, streaming, or hybrid serving based on decision latency and data-arrival characteristics.
3. Reproduce training-time preprocessing and feature definitions exactly.
4. Enforce feature freshness and availability checks before inference.
5. Separate observed-past, known-future, and forecasted-future inputs in the serving interface.
6. Define state initialization and update behavior for recurrent or streaming models.
7. Make request or batch identifiers idempotent so retries do not create inconsistent downstream actions.
8. Version model, preprocessing, feature schema, and horizon contract together.
9. Add deterministic fallback forecasts for missing features, unavailable models, cold-start entities, and partial history.
10. Bound latency with timeouts and avoid unbounded retries on external covariate services.
11. Validate recursive or autoregressive multi-step generation for state and timestamp alignment.
12. Profile throughput, memory, accelerator utilization, and tail latency at realistic loads.
13. Deploy through shadow, canary, or staged rollout when operational impact warrants it.
14. Emit prediction metadata sufficient to reconstruct each inference later.
15. Test rollback and fallback activation before full production exposure.

## Decision points
- Prefer batch serving when predictions are consumed on a predictable cadence and freshness tolerates scheduled generation.
- Prefer online or streaming serving when decisions depend on newly arriving events with tight latency.
- Cache predictions only when the cache key includes entity, cutoff, horizon, model version, and materially relevant scenario inputs.
- Use stateful serving only when it yields material latency or accuracy value and state consistency can be guaranteed.

## Common failure patterns
- Serving features computed with a different cutoff than training.
- Timezone or daylight-saving errors shifting horizons.
- Stale known-future covariates silently reused.
- Cache keys omitting model version or cutoff.
- Stateful models losing entity state after restart.
- No fallback for new entities or upstream outages.
- A successful inference response being mistaken for semantically correct prediction timing.

## Verification
Verify contract tests on representative timestamps, training-serving feature parity, cold-start behavior, late-data handling, idempotent retries, load and tail-latency targets, fallback activation, and reconstruction of sampled predictions from logged metadata.

## Expected output
A production serving design with explicit temporal contract, validated feature parity, performance evidence, fallback policy, observability metadata, and rollback procedure.

## Stop conditions
Stop and escalate if serving cannot reproduce required features, cutoff semantics are ambiguous, state consistency cannot be guaranteed for a stateful design, required production permissions are unavailable, or rollout lacks a safe fallback for high-impact decisions.