# Model Quality Monitoring

## Purpose
Detect degradation in predictive quality after deployment using delayed labels, proxy signals, and segment-aware monitoring.

## When to use
Use for production ML systems whose real-world quality can drift independently of service uptime.

## Inputs
- Production predictions
- Ground-truth labels or proxies
- Offline evaluation metrics
- Segment definitions
- Model versions

## Context to inspect
Inspect label delay, feedback loops, intervention effects, sampling differences, business seasonality, and model-version rollout history.

## Core knowledge
Production quality monitoring must account for delayed truth, changing prevalence, threshold effects, calibration, and segment heterogeneity. Proxy metrics are useful only when their relationship to real quality is validated.

## Procedure
1. Define production quality metrics aligned with offline evaluation.
2. Establish label-join logic and delay windows.
3. Monitor metrics by model version and critical segments.
4. Track threshold-sensitive metrics and calibration where relevant.
5. Establish expected variance from historical data.
6. Define warning and action thresholds.
7. Correlate degradations with data, code, and model changes.
8. Maintain a backfill process as delayed labels arrive.

## Decision points
Use proxy metrics when labels are too delayed, but validate their predictive relationship to true quality. Prefer cohort-specific thresholds when aggregate metrics conceal operational risk.

## Common failure patterns
- Monitoring only average accuracy.
- Comparing incomplete recent labels to complete historical labels.
- Ignoring class-prevalence shifts.
- Treating proxy metrics as ground truth.

## Verification
Verify metric parity between offline and production definitions, correct label alignment, reproducible historical baselines, and actionable alert routing.

## Expected output
A production quality-monitoring specification and dashboards with versioned, segment-aware metrics and thresholds.

## Stop conditions
Stop if label semantics are unstable or monitoring cannot distinguish incomplete truth from actual degradation.