# Failure Analysis

## Purpose
Diagnose why an AI model or research method fails, distinguish systematic weaknesses from noise, and turn observed errors into testable next hypotheses rather than ad hoc patching.

## When to use
Use after benchmark regressions, unexpected behavior, failed training runs, slice-specific quality drops, robustness failures, or when aggregate metrics improve while important examples degrade.

## Inputs
- Model outputs or failed runs
- Ground truth or evaluation rubrics
- Logs and training metrics
- Baseline outputs
- Dataset metadata
- Known deployment or task constraints

## Preconditions
Preserve raw predictions, prompts/inputs, configuration, and run identifiers. Confirm that evaluation errors are not caused by corrupted labels or instrumentation before attributing them to the model.

## Context to inspect
Inspect error examples, data slices, confidence or score distributions, sequence length, domain, language, difficulty, prompt format, decoding settings, training dynamics, gradient and loss metrics, retrieval/tool traces when applicable, and baseline behavior on the same items.

## Core knowledge
Senior failure analysis separates model capability failures, data failures, optimization failures, evaluation failures, interface failures, and infrastructure failures. Error taxonomies should emerge from evidence but remain operational enough to measure. Aggregate scores can hide rare but severe failure classes.

## Procedure
1. Confirm that the failure is reproducible under the recorded configuration.
2. Verify labels, evaluation logic, and input preprocessing.
3. Compare failed examples against the baseline and prior checkpoints.
4. Sample errors without selecting only memorable cases.
5. Create an initial taxonomy based on observable failure mechanisms.
6. Annotate a representative subset using the taxonomy.
7. Quantify failure rates by category and important data slices.
8. Correlate failures with measurable factors such as length, rarity, domain, confidence, retrieval quality, or training exposure.
9. Trace training or inference stages that could plausibly create each category.
10. Form one or more falsifiable hypotheses for high-impact failure classes.
11. Design minimal diagnostic experiments before implementing broad fixes.
12. Check whether proposed fixes trade one failure class for another.
13. Add durable evaluation slices or regression tests for validated failure modes.
14. Record unresolved failures and uncertainty explicitly.

## Decision points
- Fix evaluation or data defects before changing the model.
- Prioritize failure classes by severity, frequency, strategic importance, and tractability.
- Use mechanistic probes when behavioral correlations do not identify a cause.
- Prefer targeted interventions when a failure is localized; consider broader data or architecture changes when it is systemic.

## Common failure patterns
- Reading a few anecdotes and declaring a root cause.
- Treating evaluator mistakes as model mistakes.
- Patching prompts or data without measuring regression elsewhere.
- Creating taxonomy categories that overlap heavily or cannot be reproduced.
- Ignoring rare catastrophic failures because aggregate accuracy is high.
- Confusing correlation with mechanism.

## Verification
Failure analysis is implemented when errors are categorized and quantified. It is verified when categories have reproducible definitions, major causes are supported by controlled diagnostics, proposed fixes improve the targeted failures without unacceptable regressions, and durable tests capture the learned failure modes.

## Expected output
An evidence-backed error taxonomy, slice metrics, root-cause hypotheses, diagnostic experiments, prioritized remediation options, regression evaluations, and unresolved risks.

## Stop conditions
Stop and escalate when failures indicate a safety-critical issue, evaluation labels are too unreliable to support diagnosis, sensitive data cannot be inspected safely, or production evidence is required but unavailable.