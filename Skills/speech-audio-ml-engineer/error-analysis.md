# Speech Model Error Analysis

## Purpose
Turn aggregate model failures into prioritized, testable causes and corrective actions.

## When to use
Use after evaluation regressions, plateaued training, production complaints, or model comparisons.

## Inputs
Predictions, references, audio, metadata, baseline outputs, model/config versions.

## Context to inspect
Inspect errors by acoustic condition, speaker, language, duration, lexical class, device, confidence, and pipeline stage.

## Core knowledge
Error analysis should distinguish symptoms from causes and separate data, annotation, frontend, model, decoder, serving, and product-policy failures.

## Procedure
1. Reproduce the reported metric and examples.
2. Quantify error categories and cohorts.
3. Rank categories by impact and frequency.
4. Listen to representative examples.
5. Trace each category through pipeline stages.
6. Form falsifiable hypotheses.
7. Run targeted ablations or diagnostics.
8. Fix the highest-evidence cause.
9. Add regression cases.

## Decision points
Prioritize high-impact systematic errors over memorable anecdotes. Fix data when labels/coverage are causal; fix modeling only when evidence points there.

## Common failure patterns
Random tweaking, analyzing only easy-to-read transcripts, ignoring audio, confounding decoder and acoustic errors, and no regression protection.

## Verification
Demonstrate category-specific improvement plus no unacceptable guardrail regressions.

## Expected output
A ranked error taxonomy, causal evidence, corrective change, and regression tests.

## Stop conditions
Escalate when required production examples cannot be accessed safely or evidence contradicts the proposed cause.