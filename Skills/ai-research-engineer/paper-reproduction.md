# Paper Reproduction

## Purpose
Reproduce published AI research closely enough to determine whether its reported result and mechanism transfer to the current environment, and to establish a trustworthy baseline for follow-on work.

## When to use
Use before extending a paper, when a published method is strategically important, when official code is incomplete, or when reported numbers differ from internal results.

## Inputs
- Paper and supplementary material
- Official or third-party code
- Released checkpoints and datasets
- Reported hyperparameters
- Evaluation protocol
- Available compute

## Preconditions
Define the reproduction target: exact metric reproduction, directional result, mechanism reproduction, or adaptation under constrained resources. Record unavoidable deviations before running experiments.

## Context to inspect
Inspect paper revisions, appendices, issue trackers, repository commits, environment files, preprocessing, tokenizer, dataset versions, initialization, optimizer settings, batch semantics, training steps, checkpoint selection, decoding, evaluation scripts, and hardware assumptions.

## Core knowledge
Published methods often omit operational details that affect outcomes. A reproduction should distinguish faithful replication from approximate reimplementation and constrained reproduction. Failure to reproduce does not automatically falsify a paper; differences in data, scale, software, hardware, or hidden tuning may explain gaps.

## Procedure
1. Extract a structured specification from the paper before reading implementation details deeply.
2. Identify exact reported target metrics and experimental conditions.
3. Acquire official code, checkpoints, datasets, and configuration files where available.
4. Pin the source revision and environment.
5. Reproduce preprocessing and evaluation first using released checkpoints.
6. Confirm that evaluation results match published numbers within a reasonable tolerance.
7. Build or validate the training configuration.
8. Run a small smoke test and inspect learning dynamics.
9. Reproduce the smallest published setting that tests the core method.
10. Scale toward the target setting only after smaller runs are stable.
11. Record every deviation from the publication.
12. Compare learning curves, final metrics, variance, and resource usage.
13. Investigate discrepancies using issues, follow-up papers, and controlled diagnostics.
14. Classify the result as reproduced, partially reproduced, inconclusive, or not reproduced.
15. Preserve scripts, configs, raw outputs, and artifact identifiers for future work.

## Decision points
- Prefer released checkpoints for validating evaluation before spending compute on training.
- Use constrained reproduction when exact scale is impractical, but do not claim exact replication.
- Contact or consult author clarifications when a missing detail materially affects the result.
- Stop scaling if the expected mechanism is absent at validated smaller scales and no evidence suggests a scale threshold.

## Common failure patterns
- Implementing from memory or abstract descriptions.
- Comparing against a different dataset revision.
- Reproducing training before verifying evaluation.
- Failing to record deviations from the original method.
- Assuming official code always matches the paper’s final experiment.
- Declaring failure after one unstable seed.
- Quietly tuning beyond the paper while calling the result a reproduction.

## Verification
The reproduction is implemented when the method runs end to end. It is verified when published evaluation can be recreated where artifacts permit, deviations are explicit, results are repeated where variance matters, and the final classification is supported by traceable evidence.

## Expected output
A reproduction report containing target claims, artifact/version inventory, exact deviations, configs, metrics, variance, compute usage, discrepancy analysis, and reproduction classification.

## Stop conditions
Stop when required data or artifacts are legally unavailable, critical details cannot be recovered, compute requirements exceed authorized resources, safety constraints prevent execution, or discrepancies cannot be isolated enough to support a meaningful conclusion.