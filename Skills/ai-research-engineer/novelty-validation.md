# Novelty Validation

## Purpose
Determine whether a proposed AI research contribution is genuinely distinct, whether its effect exceeds known alternatives, and whether the claimed mechanism remains after controlling for simpler explanations.

## When to use
Use before investing heavily in a new method, before internal research review, before publication, or when a result resembles techniques from adjacent fields.

## Inputs
- Proposed method and claimed contribution
- Literature synthesis
- Strong baselines
- Ablation results
- Experimental evidence
- Implementation details

## Preconditions
State the contribution in one or more precise claims: new mechanism, new empirical finding, new efficiency frontier, new dataset/evaluation, new systems technique, or new combination whose interaction produces distinct value.

## Context to inspect
Inspect prior work under alternative terminology, contemporaneous preprints, citations of closely related methods, equivalent mathematical formulations, known implementation tricks, baseline tuning, data differences, compute scaling, and whether the claimed improvement survives simple controls.

## Core knowledge
Novelty is not the same as performance. A method can be useful but not novel, or novel without improving headline metrics. Renaming an established technique, combining known components without demonstrating a non-obvious interaction, or obtaining gains from extra compute/data does not support a strong methodological novelty claim.

## Procedure
1. Write the proposed contribution as explicit testable claims.
2. Search the literature using terminology for both the problem and underlying mechanism.
3. Translate the method into mathematical or algorithmic primitives to identify equivalent prior formulations.
4. Identify the closest prior methods, not merely the most famous papers.
5. Build strong comparison implementations under comparable data and compute.
6. Run simple controls that could explain the gain, such as more parameters, extra tokens, longer training, different preprocessing, or additional inference samples.
7. Use ablations to test whether the purportedly novel component is necessary.
8. Test whether the component produces consistent value across more than one setting when the claim is general.
9. Separate novelty of mechanism from novelty of application or empirical finding.
10. Record independent simultaneous work that affects priority claims.
11. Narrow the claim if evidence supports usefulness but not broad novelty.
12. Preserve negative novelty findings rather than reshaping comparisons to force differentiation.

## Decision points
- Claim methodological novelty only when the mechanism is meaningfully distinct from closest prior work.
- Claim empirical novelty when the primary contribution is a new finding rather than a new algorithm.
- Treat a known-component combination as novel only when the interaction or resulting capability is non-obvious and evidenced.
- Prefer a narrower accurate contribution over a broad claim vulnerable to obvious prior art.

## Common failure patterns
- Searching only by the project’s chosen terminology.
- Comparing against outdated or weak related work.
- Calling additional compute an algorithmic improvement.
- Hiding near-equivalent methods in adjacent subfields.
- Using ablations that do not control parameter count or budget.
- Equating implementation complexity with scientific novelty.
- Expanding the novelty claim after seeing favorable results.

## Verification
Novelty analysis is implemented when the closest related work and controls are documented. It is verified when an experienced reviewer can see the exact distinction, strong baselines have been tested fairly, simpler explanations have been controlled, and the wording of the claim matches the demonstrated evidence.

## Expected output
A novelty matrix covering closest prior methods, exact differences, controlled comparisons, ablation evidence, alternative explanations, claim boundaries, and confidence in each contribution.

## Stop conditions
Stop and revise the claim when equivalent prior work is found, gains disappear under fair controls, required closest baselines cannot be evaluated, or evidence supports only a narrower contribution than originally proposed.