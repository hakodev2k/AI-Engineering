# Bias and Fairness Evaluation

## Purpose
Detect and control demographic, behavioral, geographic, linguistic, or operational biases introduced or amplified by synthetic-data generation.

## When to use
Use whenever synthetic data affects people, regulated decisions, safety-critical systems, multilingual products, or models with known subgroup performance gaps.

## Inputs
Synthetic and real datasets, subgroup definitions, protected/sensitive attributes where lawful, fairness objectives, downstream task, risk thresholds.

## Preconditions
Fairness dimensions and legitimate business/domain constraints are defined with appropriate governance input.

## Context to inspect
Source-data imbalance, generator prompts, conditioning variables, sampling weights, label policies, subgroup error rates, intersectional coverage, historical bias.

## Core knowledge
A generator can reproduce source bias, smooth away underrepresented groups, exaggerate stereotypes, or create unrealistic parity. Fairness evaluation must consider representation, label quality, conditional relationships, and downstream outcomes.

## Procedure
1. Define relevant groups and intersections.
2. Compare representation between real and synthetic data.
3. Check label and outcome distributions by subgroup.
4. Inspect conditional relationships rather than raw proportions only.
5. Detect stereotyped or implausible associations.
6. Measure downstream performance and calibration by subgroup.
7. Test whether targeted balancing improves minority coverage without creating unrealistic priors.
8. Review high-risk examples with domain experts.
9. Document intentional distribution interventions.
10. Re-run fairness evaluation after generator or prompt changes.

## Decision points
Balance representation when training objectives require stronger minority coverage, but preserve real prevalence when estimating production fairness or calibration.

## Common failure patterns
Assuming equal counts imply fairness, ignoring intersections, generating stereotyped minority samples, and optimizing fairness metrics without validating realism.

## Verification
Representation, subgroup utility, and fairness metrics meet defined thresholds on synthetic data and independent real-world evaluation.

## Expected output
A fairness assessment with subgroup coverage, identified risks, mitigations, and residual limitations.

## Stop conditions
Stop when protected-attribute handling lacks approval, fairness goals conflict with legal or domain requirements, or synthetic data worsens critical subgroup outcomes.