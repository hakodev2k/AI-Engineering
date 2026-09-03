# Preference Data Curation

## Purpose
Curate pairwise, ranked, or scored preference data that captures the behaviors an AI system should favor while preserving legitimate disagreement and avoiding annotation artifacts that can distort alignment or reward-model training.

## When to use
Use when preparing data for preference optimization, reward modeling, response ranking, policy tuning, or evaluation of subjective response quality. Do not use preference labels as a substitute for objective ground truth when correctness can be deterministically verified.

## Inputs
- Prompt or interaction population
- Candidate responses
- Preference rubric and policy constraints
- Annotator judgments and metadata
- Model/source provenance
- Existing quality and safety evaluations

## Context to inspect
Inspect prompt distributions, candidate-generation methods, model identities, response length distributions, known failure classes, annotator guidelines, tie rates, position randomization, source balance, and any downstream trainer assumptions about labels.

## Core knowledge
Preference data is vulnerable to position bias, verbosity bias, style bias, familiarity bias, and hidden model-identification cues. A preferred response is not necessarily factually correct unless the rubric makes correctness explicit. Ties, uncertainty, and disagreement can be useful signal and should not always be forced into binary choices.

## Procedure
1. Define the preference dimensions and their priority order.
2. Sample prompts from representative production traffic and strategically important failure slices.
3. Construct candidate sets with enough quality diversity to produce informative comparisons.
4. Remove identical or trivially different candidates.
5. Blind model/source identity where practical.
6. Randomize response order and record the randomization.
7. Permit ties, abstentions, or uncertainty when the task is genuinely ambiguous.
8. Apply normal annotation qualification, calibration, and adjudication controls.
9. Measure preference rates by position, response length, source model, domain, language, and difficulty.
10. Investigate systematic annotator disagreement before filtering it out.
11. Deduplicate and split by prompt or conversation group to prevent leakage.
12. Validate the curated data with a pilot preference/reward-model experiment and slice-level evaluation.

## Decision points
Use pairwise comparisons when relative choice is easier and more reliable than absolute scoring. Use rankings when several candidates must be ordered efficiently. Use scalar scores only when annotators can apply stable anchors. Prefer expert review when the preference depends on specialized factual or safety judgment.

## Common failure patterns
- Always presenting the stronger candidate in the same position
- Forcing every comparison into a winner/loser label
- Allowing model names or stylistic fingerprints to reveal provenance
- Selecting only obviously good-versus-bad pairs that teach little
- Treating verbosity as quality
- Ignoring prompt-level train/test leakage
- Removing disagreement without diagnosing why it exists

## Verification
Implemented means preference examples are produced according to the documented protocol. Verified means order and source biases are within acceptable limits, agreement quality is understood, protected splits are clean, and pilot training improves intended preference metrics without material regressions in correctness, safety, or diversity.

## Expected output
A versioned preference dataset with prompt groups, candidate responses, judgments, uncertainty or tie metadata, provenance, bias diagnostics, split manifest, and validation evidence.

## Stop conditions
Stop and escalate when the rubric conflicts with policy, annotator agreement remains unacceptably low after clarification, candidate provenance cannot be blinded where bias is material, or preference training produces unexplained safety or correctness regressions.