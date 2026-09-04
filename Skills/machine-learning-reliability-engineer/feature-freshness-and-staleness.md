# Feature Freshness and Staleness

## Purpose
Prevent stale or delayed features from silently degrading prediction quality while keeping inference behavior predictable during upstream delays.

## When to use
Use for online or batch models whose inputs have freshness requirements, especially when features are materialized asynchronously or depend on event pipelines.

## Inputs
- Feature definitions and owners
- Expected update frequencies
- Event and materialization timestamps
- Serving latency requirements
- Fallback behavior

## Context to inspect
Inspect event time versus processing time, feature-store TTLs, upstream lag, backfills, cache behavior, late events, and whether freshness is visible to the model or serving layer.

## Core knowledge
A syntactically valid feature can be operationally invalid when too old. Freshness requirements differ by feature and use case. Reliable systems expose age explicitly, define bounded tolerance, and distinguish missing from stale values.

## Procedure
1. Identify features whose predictive meaning decays with time.
2. Define freshness expectations and maximum tolerated age for each critical feature.
3. Instrument source event time, materialization time, and serving read time.
4. Monitor age distributions by feature and cohort.
5. Define behavior for fresh, degraded, stale, and unavailable states.
6. Prevent stale values from masquerading as current values.
7. Test late events, pipeline pauses, cache persistence, and backfills.
8. Correlate staleness with prediction and business-quality metrics.
9. Alert on sustained freshness breaches using historically validated thresholds.
10. Document recovery behavior once pipelines catch up.

## Decision points
Use the stale value only when its risk is lower than fallback risk. Prefer explicit missingness or reduced-feature inference when stale inputs produce misleading confidence. Do not globally apply one TTL to semantically different features.

## Common failure patterns
- Monitoring pipeline uptime but not feature age.
- Timestamping ingestion instead of source events.
- Treating stale cached values as healthy.
- Backfills overwriting newer values.
- Ignoring feature-age differences across regions or cohorts.

## Verification
Pause or delay upstream updates and verify freshness telemetry, alerts, serving behavior, fallback activation, and clean recovery after catch-up.

## Expected output
A feature-freshness policy with age limits, telemetry, fallback rules, alerts, and tested recovery behavior.

## Stop conditions
Stop if feature timestamp semantics are ambiguous or if no safe behavior exists when a critical feature exceeds its freshness limit.