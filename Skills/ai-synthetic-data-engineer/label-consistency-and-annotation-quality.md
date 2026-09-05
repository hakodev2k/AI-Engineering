# Label Consistency and Annotation Quality

## Purpose
Ensure labels attached to synthetic records are correct, unambiguous, internally consistent, and aligned with downstream task definitions.

## When to use
Use whenever synthetic generation produces classification labels, spans, boxes, masks, rankings, scores, rationales, structured answers, or simulator-derived ground truth.

## Inputs
Label taxonomy, annotation guide, generated records, generator metadata, validators, human review process, downstream task.

## Preconditions
Label definitions and precedence rules are versioned and sufficiently precise.

## Context to inspect
Ambiguous classes, multi-label rules, negative examples, edge cases, annotation disagreements, model-generated rationales, simulator state mappings, class prevalence.

## Core knowledge
Synthetic generation can produce fluent samples with incorrect labels, especially when the same model generates both example and answer. Independent validation reduces correlated generator-label errors.

## Procedure
1. Convert label policy into explicit machine-checkable rules where possible.
2. Separate content generation from label assignment when correlated errors are likely.
3. Validate structural label constraints automatically.
4. Sample records across classes, difficulty, and generator configurations for manual review.
5. Measure agreement between independent validators or reviewers.
6. Investigate class-specific and edge-case disagreement.
7. Reject or regenerate ambiguous examples rather than forcing labels.
8. Check for lexical or visual label leakage.
9. Version label policy with every dataset release.
10. Revalidate downstream performance after label-policy changes.

## Decision points
Use deterministic labels from simulator state when ground truth is available. Use multiple independent judges or humans for subjective labels. Preserve ambiguity explicitly when the task supports it.

## Common failure patterns
Using the same prompt/model to generate and self-validate labels, forcing ambiguous cases into classes, hidden label cues, and changing taxonomy without regenerating affected data.

## Verification
Label error rates, disagreement rates, edge-case quality, and downstream class-level metrics meet predefined thresholds.

## Expected output
A validated labeled dataset, annotation-quality report, disagreement log, and versioned labeling specification.

## Stop conditions
Stop when label definitions conflict, reviewer agreement remains too low, or no independent method can validate critical labels.