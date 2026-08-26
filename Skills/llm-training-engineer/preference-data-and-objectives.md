# Preference Data and Objectives

## Purpose
Design and train preference-based objectives such as DPO-style or ranking approaches using reliable comparison data.

## When to use
Use when desired behavior is easier to express through preferences between candidate responses than through a single gold response.

## Inputs
Base/reference model, preference pairs or rankings, annotation rubric, confidence/metadata, evaluation suite, objective implementation.

## Context to inspect
Annotator agreement, position/length bias, prompt distribution, chosen/rejected quality gap, reference-policy compatibility, data leakage and safety slices.

## Core knowledge
Preference labels are noisy measurements of a rubric. Objectives can exploit annotation artifacts such as verbosity. Hyperparameters control how far policy behavior moves from the reference/base distribution.

## Procedure
1. Define the preference rubric and unacceptable shortcuts.
2. Audit annotation agreement and bias.
3. Remove invalid, duplicate and near-tie examples when labels are unreliable.
4. Stratify by task/risk/domain.
5. Validate pair serialization and log-prob computation.
6. Establish a reference/base evaluation.
7. Run conservative objective/hyperparameter pilots.
8. Measure win rate plus length, style, safety and capability regressions.
9. Inspect cases where automated judges disagree with humans.
10. Freeze data/objective versions and selection criteria.

## Decision points
Use supervised tuning when a clear target answer exists; preference optimization when relative quality is more reliable. Down-weight uncertain labels rather than pretending all comparisons are equally strong when tooling supports it.

## Common failure patterns
Length bias mistaken for helpfulness; weak rejected answers making task trivial; reference mismatch; judge-model circularity; optimizing one preference benchmark.

## Verification
Human or high-quality independent evaluation confirms gains, artifacts such as response length are controlled, and safety/base guardrails remain acceptable.

## Expected output
A preference-trained checkpoint with data-quality analysis, objective configuration, and bias-aware evaluation.

## Stop conditions
Stop when labels lack a coherent rubric, agreement is too low, or improvements disappear after controlling known biases.