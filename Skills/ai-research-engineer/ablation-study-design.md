# Ablation Study Design

## Purpose
Determine which components of an AI method actually cause observed improvements. This skill turns a complex system into controlled comparisons that test mechanism, necessity, interaction, and implementation value.

## When to use
Use after a multi-component method appears promising, before claiming novelty, when simplifying a model, or when reviewers need evidence that individual design choices matter.

## Inputs
- Full proposed method
- Validated baseline
- List of components or interventions
- Evaluation suite
- Compute budget
- Hypothesized mechanism

## Preconditions
The full method and baseline must be runnable under comparable conditions. Each component should have a clear operational definition.

## Context to inspect
Inspect architecture dependencies, training settings, data transformations, initialization, inference settings, interactions between components, and prior runs that may reveal high-variance components.

## Core knowledge
Ablations are not arbitrary feature toggles. Good ablations test necessity, sufficiency, and interactions while preserving fair training and evaluation. Removing a component can change capacity, compute, or optimization difficulty; those changes must be measured or controlled. Factorial designs can expose interactions but may be prohibitively expensive.

## Procedure
1. State the claimed mechanism for each major component.
2. Rank components by contribution to novelty and implementation complexity.
3. Define the full system and baseline reference points.
4. Design leave-one-out ablations for components whose necessity is in question.
5. Add isolated-component experiments where sufficiency matters.
6. Identify likely interactions and test the highest-value combinations.
7. Control model size, data, compute, and tuning budget where required by the claim.
8. Use the same evaluation protocol for all variants.
9. Repeat high-variance comparisons across seeds.
10. Measure secondary effects such as latency, memory, training stability, and robustness.
11. Compare observed effects with the predicted mechanism.
12. Remove components whose complexity is not justified by measurable value.

## Decision points
- Use one-factor-at-a-time ablations for interpretable, weakly interacting components.
- Use factorial or targeted interaction studies when components are coupled.
- Match parameter count when claiming algorithmic benefit independent of capacity.
- Keep a component despite neutral headline metrics only when it provides verified operational or safety value.

## Common failure patterns
- Removing multiple components at once and attributing the effect to one.
- Comparing variants with different training budgets unintentionally.
- Omitting negative ablations.
- Ignoring interaction effects.
- Retuning only the full model while leaving ablations poorly configured.
- Calling an implementation detail essential without testing it.

## Verification
An ablation study is implemented when all planned variants run under documented configurations. It is verified when comparisons isolate intended changes, uncertainty is reported, resource differences are accounted for, and conclusions match the evidence rather than the desired narrative.

## Expected output
An ablation matrix containing variant definitions, controlled differences, metrics, uncertainty, resource effects, mechanism interpretation, and recommendations for retaining or removing components.

## Stop conditions
Stop when a component cannot be isolated without fundamentally changing the problem, baseline reproduction becomes unstable, or available budget cannot resolve effects larger than expected experimental noise.