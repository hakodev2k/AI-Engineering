# Model Inversion and Sensitive Attribute Leakage

## Purpose
Evaluate whether inference outputs enable reconstruction of sensitive features, representative records, or attributes beyond intended disclosure.

## When to use
Use for models trained on sensitive data, rich prediction APIs, embeddings, generative outputs, or systems that expose explanations/confidences.

## Inputs
Model interface, data sensitivity classification, output schema, attacker assumptions, representative evaluation data, and privacy requirements.

## Preconditions
Testing must use authorized data and an isolated environment when reconstructed information may be sensitive.

## Context to inspect
Inspect embeddings, logits, confidence scores, nearest-neighbor endpoints, explanations, repeated-query behavior, and downstream caches/logging.

## Core knowledge
Inversion risk depends on output information, correlations in training data, model memorization, attacker auxiliary knowledge, and repeated access. Reconstruction quality must be judged against meaningful baselines rather than visual plausibility alone.

## Procedure
1. Define protected attributes and unacceptable disclosures.
2. Specify attacker knowledge and query budget.
3. Establish reconstruction or attribute-inference baselines without model access.
4. Test plausible inversion techniques against the exposed interface.
5. Quantify improvement over baseline and subgroup-specific risk.
6. Identify which outputs contribute most information.
7. Evaluate output minimization, aggregation, access controls, regularization, or privacy-preserving training.
8. Re-run attacks under mitigated conditions.
9. Test whether logging or caching creates secondary leakage.
10. Document residual risk and monitoring requirements.

## Decision points
Remove output fields when they are not required by consumers. Prefer coarse or aggregated outputs when product utility survives. Use stronger training-time privacy controls when interface controls cannot meet the required privacy property.

## Common failure patterns
Treating plausible reconstructions as proof; lacking a non-model baseline; ignoring auxiliary public data; testing only one subgroup; retaining sensitive embeddings indefinitely; assuming embeddings are anonymous.

## Verification
Confirm attacks are reproducible, compare to meaningful baselines, validate that mitigations reduce measurable leakage, and ensure product behavior still meets acceptance criteria.

## Expected output
An evidence-based leakage assessment with affected outputs, mitigation trade-offs, tests, and residual privacy risk.

## Stop conditions
Stop if evaluation would expose real sensitive records beyond approved handling, protected attributes are undefined, or required privacy guarantees need specialist/legal approval.