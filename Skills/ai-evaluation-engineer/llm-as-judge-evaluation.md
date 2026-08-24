# LLM-as-Judge Evaluation

## Purpose
Use language models as evaluators without mistaking automated judgment for objective ground truth.

## When to use
Use for scalable semantic scoring, rubric-based review, pairwise comparison, or triage where deterministic metrics are insufficient and human evaluation is too expensive for every run.

## Inputs
- Evaluation rubric
- Candidate responses
- Reference answers when available
- Judge model configuration
- Human-labeled calibration set

## Context to inspect
Inspect prompt templates, judge model/version, temperature, ordering effects, reference visibility, prior human agreement, and known bias patterns.

## Core knowledge
Judge models can show self-preference, verbosity bias, position bias, style bias, and correlated errors. Reliability must be measured against human or deterministic evidence, not assumed from model capability.

## Procedure
1. Define the exact judgment question and required rubric.
2. Decide whether the judge needs a reference answer or should evaluate independently.
3. Remove irrelevant model identifiers and metadata.
4. Use structured outputs with explicit criterion-level scores and rationale fields where useful.
5. Test prompt variants for stability before locking the judge protocol.
6. Randomize pairwise response order and measure position effects.
7. Run repeated judgments on a calibration subset to estimate variance.
8. Compare against expert human labels and calculate agreement/error patterns.
9. Identify slices where judge reliability falls below acceptable levels.
10. Route low-confidence or high-risk cases to human review.
11. Version judge model, prompt, rubric, and parsing logic together.

## Decision points
Use a single judge for low-risk high-volume screening, multiple judges for contentious cases, and human adjudication for consequential decisions. Prefer deterministic checks whenever correctness can be established mechanically.

## Common failure patterns
- Using the evaluated model as its own uncalibrated judge
- Accepting verbose answers as better answers
- Ignoring ordering effects
- Changing judge model between experiments
- Treating judge rationale as proof of correctness

## Verification
Verify agreement against a representative human-labeled set, ordering robustness, repeatability, parse success, and slice-level reliability.

## Expected output
A calibrated and versioned judge configuration with documented agreement, bias checks, failure slices, and escalation rules.

## Stop conditions
Stop when judge agreement is inadequate for the release decision, systematic bias remains unresolved, or no trustworthy calibration evidence exists.