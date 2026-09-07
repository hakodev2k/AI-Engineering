# RLAIF and Synthetic Preferences

## Purpose
Use AI-generated critique, ranking, and preference signals to scale post-training while controlling evaluator bias, self-preference, and synthetic-data collapse.

## When to use
Use when human labeling is too costly for broad coverage, when rubrics can be applied reliably by strong judge models, or when synthetic preferences augment rather than replace critical human oversight.

## Inputs
Target rubric, teacher/judge models, prompt distribution, candidate responses, human calibration subset, safety requirements, and provenance metadata.

## Preconditions
At least one independent human-labeled calibration set exists and judge-model limitations are understood on high-impact slices.

## Context to inspect
Inspect judge prompts, teacher/student model relationships, position and verbosity bias, temperature, critique generation, label confidence, model families, language coverage, and whether synthetic examples recursively depend on prior synthetic outputs.

## Core knowledge
RLAIF scales supervision but can amplify the judge's preferences and blind spots. A judge from the same model family may favor familiar style. Rationales can improve consistency but also anchor subsequent judgments. Synthetic supervision should be treated as a measured instrument whose error varies by slice.

## Procedure
1. Define a rubric that can be applied without hidden context.
2. Build a human-labeled calibration set spanning routine, ambiguous, and high-risk cases.
3. Evaluate candidate judges against humans by slice.
4. Randomize response order and remove model identity cues.
5. Use multiple judge prompts or models where correlated bias is a concern.
6. Generate critiques before rankings only if experiments show better calibration.
7. Reject or down-weight low-confidence and contradictory synthetic labels.
8. Keep synthetic provenance explicit through every transformation.
9. Blend human and synthetic preferences according to measured reliability, not convenience.
10. Train a pilot policy and measure whether judge gains transfer to human evaluation.
11. Inspect whether the policy learns judge-specific verbosity, phrasing, or refusal patterns.
12. Refresh calibration after major policy changes because judge error can shift with the policy distribution.

## Decision points
Use AI labels aggressively for low-risk, well-calibrated slices; retain humans for policy ambiguity, cultural nuance, and severe safety consequences. Prefer heterogeneous judges when independence matters more than cost. Do not recursively regenerate data indefinitely without fresh external anchors.

## Common failure patterns
Self-preference; verbosity bias; judge prompt leakage; synthetic monoculture; false confidence on rare languages; using judge agreement as proof of correctness; replacing all human checks after one calibration round.

## Verification
Compare AI labels to human labels by slice, measure bias correlations, audit disagreements, and validate the trained policy with independent human or objective evaluations. Track the fraction and lineage of synthetic supervision.

## Expected output
A calibrated RLAIF pipeline, synthetic preference dataset with provenance, judge-quality report, mixing policy, and documented unsupported slices.

## Stop conditions
Stop if judge-human agreement is inadequate on critical behavior, synthetic labels systematically favor exploitable artifacts, provenance is lost, or policy gains fail to transfer to independent evaluation.