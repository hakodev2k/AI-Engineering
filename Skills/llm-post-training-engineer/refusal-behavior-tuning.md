# Refusal Behavior Tuning

## Purpose
Engineer precise refusal behavior that is policy-correct, minimally disruptive, consistent in tone, and useful when safe alternatives are allowed.

## When to use
Use when a model refuses too broadly, complies where it should refuse, leaks disallowed details inside refusals, or produces inconsistent boundary behavior across equivalent prompts.

## Inputs
Policy categories, refusal templates or style guidance, harmful and benign-neighbor examples, multi-turn scenarios, evaluation rubrics, and base/tuned checkpoints.

## Preconditions
Allow/refuse boundaries are defined well enough to adjudicate representative examples.

## Context to inspect
Inspect refusal rates by category, false-positive refusals, response length, policy wording exposure, adversarial paraphrases, language variants, conversational history, and runtime moderation interactions.

## Core knowledge
A good refusal is not simply a negative answer. It should enforce the boundary, avoid adding harmful actionable detail, preserve conversational usefulness, and not reveal internal policy text unnecessarily. Over-refusal commonly arises when harmful examples lack matched benign counterparts. Refusal quality must be assessed separately from refusal correctness.

## Procedure
1. Partition examples into must-refuse, may-safe-complete, and must-answer classes.
2. Create matched benign/harmful pairs that differ in the policy-relevant feature.
3. Define acceptable refusal content, tone, and maximum necessary explanation.
4. Add examples of safe redirection when useful alternatives exist.
5. Include adversarial prompts that ask the model to restate or justify prohibited content.
6. Train with enough positive-answer examples to protect benign behavior.
7. Evaluate refusal decision and refusal quality as separate metrics.
8. Measure leakage of harmful procedural information inside refusals.
9. Test equivalent prompts across wording, language, and conversation history.
10. Inspect whether the model repeatedly lectures or refuses unrelated follow-ups after one unsafe turn.
11. Compare behavior with runtime safety layers for conflicts.
12. Iterate on boundary examples rather than merely increasing refusal examples.

## Decision points
Prefer concise refusal when additional explanation increases leakage risk. Prefer safe completion when policy explicitly allows bounded educational or preventive help. Use runtime enforcement for action permissions rather than relying on refusal tuning alone.

## Common failure patterns
Blanket refusal after safety tuning; verbose policy sermons; unsafe details embedded in explanations; inconsistent treatment of paraphrases; refusal persistence after topic change; different boundaries across languages.

## Verification
Measure false refusal, unsafe compliance, leakage, safe-redirection quality, multilingual parity, and multi-turn recovery. Manually audit critical categories and near-boundary cases.

## Expected output
A checkpoint or training-data change with documented refusal decision quality, response-quality metrics, benign preservation results, and remaining edge cases.

## Stop conditions
Stop if policy boundaries remain unresolved, refusal tuning materially damages ordinary assistance, or critical leakage cannot be separated from the refusal style.