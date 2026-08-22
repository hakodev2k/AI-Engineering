# Attribution and Incrementality

## Purpose
Estimate how marketing contributes to outcomes while distinguishing observed credit from causal incremental impact.

## When to use
Use for channel evaluation, budget allocation, campaign measurement, executive reporting, and when platform attribution disagrees with business results.

## Inputs
Conversion data, exposure data, channel spend, first-party customer data, attribution models, experiment capability, geography or audience structure, and historical baselines.

## Context to inspect
Inspect tracking loss, cross-device behavior, attribution windows, view-through rules, self-attributing platforms, organic demand, seasonality, channel overlap, and conversion lag.

## Core knowledge
Attribution allocates credit; incrementality estimates what would not have happened without the marketing intervention. No attribution model creates causal truth from observational data. Randomized holdouts are strongest when feasible; geo or matched-market tests can provide alternatives.

## Procedure
1. Define the decision and outcome to measure.
2. Audit how each system assigns credit.
3. Quantify overlap and unattributed conversions.
4. Compare multiple attribution views rather than accepting one as truth.
5. Identify channels where causality uncertainty matters economically.
6. Design holdout, geo, lift, or other incrementality tests where feasible.
7. Predefine exposure, outcome, contamination, and analysis rules.
8. Measure incremental conversions and cost per incremental outcome.
9. Compare experimental results with platform-reported performance.
10. Adjust planning assumptions and document confidence ranges.

## Decision points
Use attribution for operational directional reporting when experiments are impractical; use incrementality for material allocation decisions. Prefer simple models that stakeholders understand over complex models with unverifiable assumptions.

## Common failure patterns
Summing conversions across platforms, treating last-click as causal, ignoring organic baseline, contaminated holdouts, underpowered lift tests, and assuming attributed ROAS equals incremental ROAS.

## Verification
Reconcile total conversions, validate experiment assignment, test for pre-period balance, quantify uncertainty, and check whether conclusions remain robust under reasonable model choices.

## Expected output
A measurement view separating attributed and incremental performance, with confidence, limitations, and allocation implications.

## Stop conditions
Stop causal claims when experiment integrity fails, contamination is excessive, or data cannot distinguish exposed from control populations reliably.