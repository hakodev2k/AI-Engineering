# Model Interpretability and Probing

## Purpose
Use behavioral probes, representation analysis, attribution methods, and controlled interventions to investigate what information an AI model uses and whether observed behavior is consistent with a hypothesized mechanism.

## When to use
Use when behavioral metrics are insufficient to explain a result, when comparing internal representations, investigating shortcuts or spurious correlations, validating a mechanistic hypothesis, or diagnosing unexpected generalization.

## Inputs
- Model checkpoints
- Research hypothesis
- Probe datasets or controlled examples
- Access to activations, gradients, attention, or intermediate states when available
- Baseline models

## Preconditions
Define the exact question the probe should answer. Avoid treating interpretability tools as direct explanations without validating that the measurement is causally relevant.

## Context to inspect
Inspect architecture, layer structure, tokenization, normalization, activation hooks, model mode, inference settings, checkpoint provenance, probe-data leakage, and existing behavioral evidence.

## Core knowledge
Linear probes can reveal decodable information without proving the model uses it. Attribution methods can be unstable or method-dependent. Attention weights alone are not sufficient explanations. Stronger evidence comes from interventions such as activation patching, feature ablation, counterfactual inputs, causal mediation, or targeted perturbations that change behavior as predicted.

## Procedure
1. State the mechanistic or representational hypothesis.
2. Define a behavioral baseline that the internal analysis should help explain.
3. Build controlled probe data that separates the target factor from obvious confounders.
4. Select the least complex probe capable of testing the question.
5. Compare against random, shuffled-label, or capacity-matched controls.
6. Measure probe performance across layers or components when relevant.
7. Test whether the identified signal generalizes to held-out distributions.
8. Use attribution or feature-importance methods as exploratory evidence, not final proof.
9. Design an intervention that should change behavior if the hypothesized mechanism is causal.
10. Measure both intended and unintended behavioral effects of the intervention.
11. Replicate key findings across examples, seeds, or checkpoints.
12. Compare findings with simpler alternative explanations.
13. Record limitations of the interpretability method explicitly.

## Decision points
- Use probing for representation availability; use interventions for causal-use claims.
- Prefer controlled synthetic examples when they isolate a mechanism that natural data cannot.
- Use multiple complementary methods when a high-stakes conclusion depends on interpretability evidence.
- Avoid expensive mechanistic analysis if a straightforward behavioral experiment can answer the decision question.

## Common failure patterns
- Claiming the model “uses” a feature because a probe can decode it.
- Interpreting attention maps as causal explanations.
- Using probes with enough capacity to learn the task independently.
- Ignoring tokenizer or positional artifacts.
- Selecting visually compelling examples rather than representative ones.
- Failing to test alternative mechanisms.

## Verification
The analysis is implemented when probes or interpretability measurements run reproducibly. It is verified when controls rule out trivial explanations, interventions change behavior in the predicted direction when causal claims are made, findings replicate, and limitations are documented.

## Expected output
A mechanistic question, probe/intervention design, control results, layer/component findings, behavioral effects, alternative explanations, and confidence-qualified conclusion.

## Stop conditions
Stop when the selected method cannot distinguish the proposed mechanisms, model access is insufficient for the intended causal claim, probe data are contaminated, or observed effects fail replication.