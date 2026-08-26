# Experiment Design and Ablation

## Purpose
Design training experiments that isolate causal effects and produce decisions rather than ambiguous collections of runs.

## When to use
Use for architecture, data, optimizer, objective, precision, or systems changes whose benefit is uncertain.

## Inputs
Hypothesis, baseline, candidate change, metrics, expected effect size, compute budget, sources of variance.

## Context to inspect
Previous experiments, config differences, random seeds, data snapshots, hardware/software versions, evaluation variance, and confounders.

## Core knowledge
Changing multiple variables at once destroys attribution. Large training runs are expensive enough that experiment design should define the decision rule before results. Replication is most valuable near decision boundaries.

## Procedure
1. State a falsifiable hypothesis.
2. Choose a single authoritative baseline.
3. Identify confounders and variables to hold fixed.
4. Define primary metric, guardrails and expected effect.
5. Select scale and duration sufficient to expose the mechanism.
6. Run matched baseline/candidate experiments.
7. Replicate when variance could change the decision.
8. Analyze effect size, uncertainty and slice behavior.
9. Record negative results and rejected hypotheses.
10. Promote changes only with reproducible evidence.

## Decision points
Use factorial designs when interactions are the question and budget supports them. Use sequential experiments when later choices depend on earlier evidence. Do not spend full-scale compute to answer a question observable at smaller scale.

## Common failure patterns
Baseline drift; cherry-picking checkpoints; no predeclared metric; too-short pilots; hidden data differences; treating one seed as certainty.

## Verification
Configs differ only as intended, results reproduce within expected variance, and the conclusion follows the predefined decision rule.

## Expected output
An experiment record with hypothesis, controls, run lineage, statistical interpretation, and decision.

## Stop conditions
Stop when confounders cannot be controlled, baseline cannot be reproduced, or compute cost exceeds the value of the decision.