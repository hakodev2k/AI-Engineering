# False Positive Reduction

## Purpose
Reduce incorrect or low-value findings without making the analyzer silently unsound or hiding important defects.

## When to use
Use when adoption is limited by noisy findings, framework idioms are mis-modeled, or a rule has poor signal in production codebases.

## Inputs
Finding samples, dismissed findings, user feedback, defect ground truth where available, rule implementation, framework models, and performance data.

## Preconditions
Separate true false positives from findings that are correct but poorly explained or low priority.

## Context to inspect
Rule predicates, analysis joins, unknown-call behavior, generated code, framework contracts, suppressions, source mapping, and finding ranking.

## Core knowledge
False-positive reduction should target root causes such as imprecise aliases, missing summaries, infeasible paths, or ambiguous diagnostics. Adding ad-hoc exclusions can create hidden false negatives and long-term rule brittleness.

## Procedure
1. Sample and classify noisy findings.
2. Reproduce each representative case.
3. Identify the precision loss or semantic mismatch causing it.
4. Group cases by root cause.
5. Prefer reusable model/analysis improvements over rule-specific exceptions.
6. Add path/context sensitivity only where measured value exceeds cost.
7. Improve explanations when the finding is technically correct but misunderstood.
8. Add regression tests before changing logic.
9. Re-evaluate true-positive corpora for lost detections.
10. Measure signal and runtime after the change.

## Decision points
Use suppression for legitimate project-specific intent; change analysis logic when a broadly safe pattern is misclassified. Do not lower severity merely to avoid fixing incorrect semantics.

## Common failure patterns
Whitelist accumulation, overfitting one repository, suppressing generated-looking paths by name alone, and reducing noise by removing conservative handling globally.

## Verification
Compare pre/post true-positive and false-positive suites, manually review changed findings, and monitor precision metrics on representative code.

## Expected output
A documented precision improvement with regression protection and evidence that detection quality did not materially regress.

## Stop conditions
Stop when ground truth is insufficient to judge the change or proposed noise reduction would violate an explicit soundness requirement.