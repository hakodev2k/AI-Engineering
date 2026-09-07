# Preference Labeling Quality

## Purpose
Operate and audit human or model-assisted preference labeling so the resulting signal is consistent, explainable, and fit for optimization.

## When to use
Use when launching a labeling program, onboarding annotators, changing rubrics, investigating noisy reward signals, or validating model-judge assistance.

## Inputs
Rubric, label interface, sample tasks, annotator metadata allowed by policy, adjudication records, agreement statistics, and downstream training results.

## Preconditions
Labelers have task-relevant guidance, can abstain, and sensitive examples are handled under appropriate controls.

## Context to inspect
Review ambiguous rubric language, gold examples, position randomization, qualification tests, annotator workload, model-judge prompts, disagreement patterns, and historical label drift.

## Core knowledge
Agreement is diagnostic, not an end goal. Low agreement may indicate a bad rubric, intrinsically subjective tasks, weak expertise, or poor candidate contrasts. Excessively high agreement can indicate trivial comparisons. Model judges inherit systematic biases and should not silently become ground truth.

## Procedure
1. Convert objectives into concise decision rules with precedence examples.
2. Build qualification and calibration sets spanning common and difficult cases.
3. Train labelers using explanations for both correct and incorrect judgments.
4. Randomize response position and remove irrelevant provenance cues.
5. Permit tie, abstain, and escalation outcomes.
6. Measure agreement by task slice, not only globally.
7. Sample labels for expert audit continuously.
8. Adjudicate high-impact disagreements and feed lessons back into the rubric.
9. Detect drift by replaying stable calibration examples over time.
10. Compare model-assisted labels against independent human judgments before scaling automation.
11. Investigate annotator-level anomalies without assuming disagreement means poor performance.
12. Track rubric and workforce changes alongside dataset versions.

## Decision points
Use single labels for clear low-risk cases after calibration; use redundancy for ambiguous or high-impact cases. Use model judges for triage or scale only where bias audits show acceptable performance. Split a rubric into dimensions when one binary decision mixes correctness, style, and policy.

## Common failure patterns
Forced choices; punitive treatment of legitimate abstention; stale calibration sets; hidden model identity cues; majority vote without expert adjudication; optimizing agreement by making examples too easy; judge-model self-preference.

## Verification
Check calibration accuracy, agreement by slice, disagreement causes, position/length bias, audit pass rate, and stability over time. Confirm downstream training benefits persist on independently labeled evaluations.

## Expected output
A labeling-quality report, versioned rubric, calibrated workforce/process, adjudication policy, and documented confidence limits.

## Stop conditions
Stop scaling if critical slices show unstable judgments, judge automation has systematic bias, annotators lack required expertise, or safety/privacy controls are insufficient.