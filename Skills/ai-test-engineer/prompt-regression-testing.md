# Prompt Regression Testing

## Purpose
Detect behavioral regressions caused by prompt, system-message, few-shot, template, or context-assembly changes.

## When to use
Use before releasing any prompt-stack change or when a model/provider update can alter prompt behavior.

## Inputs
Current and candidate prompts, evaluation suite, model configuration, expected invariants, historical failures, and release thresholds.

## Preconditions
A baseline configuration can be rerun and meaningful test cases exist.

## Context to inspect
Inspect all prompt layers, templating logic, variable insertion, tool schemas, retrieval context, model settings, and production prompt versioning.

## Core knowledge
Prompt changes can improve average quality while breaking rare instructions, structured output, safety, localization, or tool behavior. Comparisons must pin all non-target variables where possible.

## Procedure
1. Snapshot baseline prompt and model configuration.
2. Identify changed prompt components and intended effect.
3. Select representative, edge, adversarial, and historical-regression cases.
4. Define hard invariants and score-based metrics.
5. Run baseline and candidate under equivalent settings.
6. Compare pass rates, quality distributions, latency, token use, and safety outcomes.
7. Inspect cases that flip from pass to fail and vice versa.
8. Test prompt-template escaping and untrusted-variable boundaries.
9. Repeat stochastic cases enough to detect unstable behavior.
10. Record trade-offs and decide release, revise, or reject.

## Decision points
Use paired comparisons when evaluating the same cases. Accept a local regression only when explicitly justified by larger product value and risk ownership.

## Common failure patterns
Changing model and prompt simultaneously, testing only average scores, omitting old failures, not pinning temperature/configuration, and accepting one lucky run.

## Verification
Confirm all hard invariants pass and reported improvements remain under repeated runs and category-level inspection.

## Expected output
A baseline-versus-candidate regression report with failing cases, metric deltas, and release recommendation.

## Stop conditions
Stop when the baseline cannot be reproduced or a severe regression appears in a protected behavior.