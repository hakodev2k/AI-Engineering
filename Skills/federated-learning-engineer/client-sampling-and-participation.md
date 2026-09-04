# Client Sampling and Participation

## Purpose
Design client selection that balances statistical quality, fairness, reliability, and system efficiency under partial participation.

## When to use
Use when defining round scheduling, handling intermittent clients, reducing participation bias, or investigating unstable training caused by changing client populations.

## Inputs
Eligible client population, availability history, client sizes, cohorts, device/site constraints, fairness requirements, privacy limits, and round capacity.

## Context to inspect
Inspect who is eligible, who is actually available, whether availability correlates with data distribution, and whether some clients are repeatedly excluded.

## Core knowledge
Uniform sampling is simple but may underrepresent rare cohorts or overweight tiny clients relative to data volume. Availability bias can systematically distort the trained model. Sampling policy affects both convergence and fairness.

## Procedure
1. Define eligibility independently from temporary availability.
2. Quantify historical participation by cohort.
3. Establish a uniform/random baseline.
4. Compare client-uniform and data-weighted strategies.
5. Add stratification only for clear statistical or fairness needs.
6. Bound repeated participation by the same clients when appropriate.
7. Handle dropout after selection without silently biasing aggregation.
8. Measure effective participation and inclusion probabilities.
9. Test selection under realistic outage and churn scenarios.
10. Audit cohort representation over time.

## Decision points
Use weighted sampling when client sizes differ materially and the target objective is sample-weighted. Use stratification when rare populations would otherwise disappear. Avoid deterministic selection that exposes or entrenches client identity patterns.

## Common failure patterns
- Sampling only always-online clients.
- Confusing eligible and available populations.
- Double-weighting by sampling probability and aggregation weight.
- No correction for dropout.
- Fairness goals stated without measurable representation targets.

## Verification
Verify participation distributions, inclusion probabilities, convergence, and cohort metrics across realistic availability traces.

## Expected output
A documented sampling policy with rationale, implementation rules, monitoring metrics, and bias controls.

## Stop conditions
Stop if availability telemetry is missing, cohort definitions are sensitive or unjustified, or the target population is undefined.