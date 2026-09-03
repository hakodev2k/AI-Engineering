# Evaluation Set Construction

## Purpose
Construct independent evaluation datasets that measure the capabilities, failure modes, and distribution shifts the AI system actually needs to handle, without leaking test information into training or development decisions.

## When to use
Use when creating a new benchmark, refreshing an internal evaluation suite, validating a domain-specific model, defining launch gates, or adding challenge sets for known high-impact failures.

## Inputs
- Product and model goals
- Production or target-task distributions
- Known failure taxonomy
- Ground-truth or annotation resources
- Protected training-data exclusions
- Required metrics and confidence targets

## Context to inspect
Inspect existing training sources, prior evaluations, production traffic, group or entity identifiers, benchmark contamination controls, historical model failures, annotation rubrics, test-set access patterns, and whether evaluation results will drive repeated tuning.

## Core knowledge
A useful evaluation suite usually combines representative slices with deliberately difficult or safety-critical challenge slices. Aggregate scores can hide severe regressions. Evaluation data must be sufficiently independent from training, accurately labeled, statistically meaningful for target slices, and protected from repeated optimization that effectively turns the test set into training data.

## Procedure
1. Define the decisions the evaluation must support and the metrics tied to those decisions.
2. Identify representative operational slices and high-impact tail cases.
3. Choose sampling strategies separately for representative and challenge components.
4. Apply group, temporal, source, or entity isolation where needed.
5. Exclude training candidates and near duplicates using contamination controls.
6. Define ground-truth creation and adjudication procedures appropriate to task risk.
7. Ensure important slices have enough examples for meaningful comparisons.
8. Preserve natural prevalence for aggregate metrics while reporting challenge slices separately.
9. Freeze identifiers, version the dataset, and restrict unnecessary access.
10. Run baseline and reference models to detect broken, trivial, or ambiguous examples.
11. Review disagreements and remove or relabel invalid items without tuning to favor a particular model.
12. Document confidence intervals, slice definitions, limitations, and refresh policy.

## Decision points
Use production-weighted samples when estimating real-world aggregate performance. Use challenge sets when rare failures are strategically important. Prefer human or expert ground truth when automated metrics are unreliable. Use a rolling evaluation only when freshness is essential and the refresh process itself can remain contamination-resistant.

## Common failure patterns
- Building the entire evaluation set from failures of one current model
- Randomly splitting correlated records from the same user, document, or session
- Repeatedly inspecting test examples during prompt or model tuning
- Reporting only an overall average
- Using low-quality automatically generated ground truth without review
- Allowing public benchmark copies or explanations into training
- Changing the test set after seeing undesirable model results without principled criteria

## Verification
Implemented means the evaluation set is versioned, labeled, split, and executable. Verified means leakage checks pass, audited labels meet quality targets, target slices have adequate coverage, baseline results are plausible, and access history supports the claim that the set remained independent from training decisions.

## Expected output
A protected evaluation release with immutable identifiers, slice definitions, ground-truth provenance, contamination checks, metric specification, baseline results, statistical limitations, and access policy.

## Stop conditions
Stop and escalate when ground truth cannot be defined reliably, training overlap cannot be bounded, critical slices are too small for meaningful interpretation, or the proposed evaluation has already been materially exposed to the development process.