# Poisoning and Byzantine Robustness

## Purpose
Detect and reduce the impact of malicious or faulty client updates without destroying useful signal from legitimate heterogeneous clients.

## When to use
Use when clients may be compromised, updates are untrusted, or anomalous training behavior suggests poisoning or Byzantine failures.

## Inputs
Client updates or approved summaries, aggregation method, expected update statistics, client identity signals, threat model, and validation data.

## Context to inspect
Inspect update norms, directions, temporal consistency, cohort differences, sybil risk, secure-aggregation visibility, and legitimate non-IID outliers.

## Core knowledge
Robust aggregation methods make different assumptions about malicious fraction, dimensionality, and update distribution. Aggressive outlier rejection can suppress minority clients and degrade fairness.

## Procedure
1. Define attacker capability and maximum assumed malicious fraction.
2. Establish normal update-distribution baselines.
3. Instrument norms, cosine similarities, and validation effects where privacy permits.
4. Simulate targeted and untargeted poisoning attacks.
5. Compare mean aggregation with robust alternatives such as trimmed statistics or geometric methods.
6. Add clipping and rate controls where justified.
7. Separate identity/sybil defense from statistical robustness.
8. Measure false positives on legitimate heterogeneous clients.
9. Test defenses under realistic participation and secure-aggregation constraints.
10. Define alert and quarantine criteria.

## Decision points
Choose defenses based on the actual threat and visibility model. Prefer simple clipping plus monitoring when stronger robust aggregation adds large utility loss. Do not assume anomaly detection alone blocks adaptive attackers.

## Common failure patterns
- Labeling all non-IID clients as malicious.
- Evaluating only random noise attacks.
- Ignoring sybil amplification.
- Robustness assumptions incompatible with secure aggregation.
- No clean-quality regression measurement.

## Verification
Run controlled attack simulations, confirm bounded quality degradation, and measure false-positive impact on legitimate clients and cohorts.

## Expected output
A tested poisoning-defense strategy with assumptions, attack coverage, thresholds, residual risks, and incident actions.

## Stop conditions
Stop if malicious-fraction assumptions are unknown, privacy controls prevent required signals with no alternative, or defense materially harms legitimate populations.