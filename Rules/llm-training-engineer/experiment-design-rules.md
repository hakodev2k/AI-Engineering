# Experiment Design Rules

## Purpose
Produce causal, decision-useful evidence from expensive training experiments.

## Scope
Ablations, scaling studies, hyperparameter experiments, architecture comparisons, and training-method comparisons.

## MUST
- Every decision-driving experiment MUST state a hypothesis, controlled variables, primary metrics, baseline, and decision rule.
- Comparisons MUST control or explicitly account for compute, data, token budget, evaluation set, and checkpoint selection differences.
- Exploratory and confirmatory analyses MUST be distinguished.
- Failed or negative experiments MUST retain enough metadata to prevent needless repetition.
- Large-scale experiments MUST be justified by smaller evidence when a lower-cost test can falsify the hypothesis.

## MUST NOT
- MUST NOT infer causality from runs that changed multiple material factors without qualification.
- MUST NOT select only favorable checkpoints or metrics after results are known and present them as pre-specified evidence.
- MUST NOT hide failed runs that materially change interpretation of a technique.

## SHOULD
- Experiments SHOULD estimate variance using repeated runs or suitable uncertainty analysis when noise could change decisions.
- Ablations SHOULD isolate mechanisms rather than only compare final bundles.

## Exceptions
Operational emergencies may require non-ideal comparisons; conclusions must then be labeled provisional.

## Verification
Review experiment specs, run configs, compute/token accounting, evaluation records, checkpoint-selection policy, and experiment tracker history.