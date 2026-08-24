# Safety and Policy Evaluation

## Purpose
Evaluate whether AI systems comply with safety, policy, and product constraints under normal, ambiguous, and adversarial inputs.

## When to use
Use before deploying models or agents with safety boundaries, after policy changes, after incidents, or when integrating new tools, modalities, or domains.

## Inputs
- Applicable policy and product rules
- Risk taxonomy
- Candidate system
- Adversarial and normal test cases
- Historical incident examples

## Context to inspect
Inspect system prompts, classifiers, tool permissions, moderation layers, refusal logic, fallback behavior, and policy version.

## Core knowledge
Safety evaluation must measure both over-refusal and under-refusal. High-severity failures should be analyzed separately from aggregate rates. Attack diversity matters because brittle systems may pass templated tests while failing paraphrases or multi-turn escalation.

## Procedure
1. Translate policy requirements into observable behaviors.
2. Build risk categories with severity and expected response behavior.
3. Include benign controls to measure excessive refusal.
4. Create direct, indirect, obfuscated, multilingual, and multi-turn variants where relevant.
5. Evaluate both final response and tool/action behavior.
6. Record policy violation type and severity per failure.
7. Analyze attack success and benign refusal by slice.
8. Review severe failures manually regardless of aggregate pass rate.
9. Add newly discovered production incidents to a protected regression set.
10. Version the suite with the governing policy.

## Decision points
Use zero-tolerance hard gates for catastrophic behaviors where appropriate. Use graded thresholds for lower-severity, inherently ambiguous categories. Escalate policy interpretation disputes rather than inventing local rules.

## Common failure patterns
- Testing only obvious prompts
- Ignoring false-positive refusals
- Averaging severe and minor failures
- Evaluating text but not actions
- Using stale policy definitions

## Verification
Verify category coverage, benign-control performance, severe-case review, reproducibility, and that known historical safety regressions are detected.

## Expected output
A policy-aligned safety evaluation report with severity-aware failures, refusal quality, attack slices, and release implications.

## Stop conditions
Stop when policy requirements are ambiguous, high-risk tests cannot be executed safely, or required reviewers lack authority to interpret the governing policy.