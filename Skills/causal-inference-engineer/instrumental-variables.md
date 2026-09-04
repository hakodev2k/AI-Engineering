# Instrumental Variables

## Purpose
Estimate causal effects when treatment is confounded but a credible source of exogenous treatment variation exists.

## When to use
Use when an instrument affects treatment, is plausibly independent of unmeasured outcome determinants, and affects the outcome only through treatment.

## Inputs
- Candidate instrument
- Treatment and outcome
- Covariates
- Assignment mechanism evidence
- Target population

## Context to inspect
Inspect instrument strength, direct pathways, compliance behavior, heterogeneous effects, clustered assignment, and manipulation of the instrument.

## Core knowledge
IV identification relies on relevance, independence, exclusion, and often monotonicity. Under heterogeneous effects, common estimators identify a local average treatment effect for compliers, not necessarily the ATE.

## Procedure
1. Define the causal estimand and why ordinary adjustment is insufficient.
2. Explain the instrument assignment mechanism.
3. Draw a causal graph including possible direct paths and common causes.
4. Test first-stage relevance and quantify instrument strength.
5. Assess covariate balance around instrument assignment where meaningful.
6. Defend exclusion using domain evidence, not statistical tests alone.
7. Assess monotonicity and possible defiers.
8. Estimate the first stage and reduced form.
9. Estimate the IV effect using a method appropriate to treatment/outcome structure.
10. Use weak-instrument-robust inference when needed.
11. Report the population to which the effect applies.
12. Run alternative instruments or falsification outcomes when available.

## Decision points
Prefer randomized encouragement or natural assignment mechanisms over convenience instruments. Reject an instrument with plausible direct effects even if statistically strong.

## Common failure patterns
- Choosing instruments based only on correlation
- Weak first stage
- Unjustified exclusion restriction
- Reporting LATE as population ATE
- Conditioning on post-instrument variables

## Verification
Verify instrument relevance, assignment rationale, exclusion analysis, target population, uncertainty, and sensitivity to weak-instrument concerns.

## Expected output
IV identification argument, diagnostics, effect estimate, uncertainty, and explicit interpretation of the complier population.

## Stop conditions
Stop when the exclusion or independence assumptions are not credible, or the instrument is too weak for reliable inference.