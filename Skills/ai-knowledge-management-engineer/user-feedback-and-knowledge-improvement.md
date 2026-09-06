# User Feedback and Knowledge Improvement

## Purpose
Turn user corrections, failed searches, low-confidence answers, and support signals into controlled improvements to sources, metadata, retrieval, and evaluation rather than ad hoc prompt patches.

## When to use
Use when operating a mature knowledge assistant, triaging repeated user complaints, or establishing a continuous improvement loop.

## Inputs
User feedback, search logs, answer ratings, support tickets, retrieval traces, source owners, evaluation sets, and change-management rules.

## Context to inspect
Inspect recurring failed queries, zero-result searches, reformulations, low-rated answers, citation complaints, source defects, unresolved content requests, and recent configuration changes.

## Core knowledge
Feedback is biased: dissatisfied and expert users may report more often, ratings may reflect tone rather than correctness, and a bad answer may stem from missing knowledge, retrieval, ranking, prompt behavior, or user expectations. Improvement requires classification before remediation.

## Procedure
1. Collect explicit and implicit feedback with appropriate privacy controls.
2. Link feedback to query, retrieval, answer, source, and version traces.
3. Classify failures into missing knowledge, stale knowledge, parsing, metadata, retrieval, ranking, grounding, usability, or unsupported-use-case categories.
4. Quantify recurrence and user impact.
5. Route source-content defects to accountable knowledge owners.
6. Add representative failures to evaluation sets before changing behavior.
7. Apply the smallest fix at the earliest responsible layer.
8. Re-run retrieval and answer evaluations.
9. Measure whether the target failure decreases without creating regressions.
10. Close feedback items with evidence and retain recurring-failure trends.

## Decision points
Fix source content when the canonical knowledge is wrong or missing; fix retrieval when evidence exists but is not surfaced; adjust prompting only when evidence is correct and retrieval is adequate.

## Common failure patterns
Treating thumbs-down as ground truth, patching prompts for missing documents, ignoring silent zero-result queries, allowing users to directly overwrite canonical knowledge, and fixing individual examples without regression tests.

## Verification
Reproduce the original failure, confirm the selected root-cause category, validate the remediation on the captured case and held-out cases, and track recurrence after release.

## Expected output
A prioritized feedback backlog with root-cause classification, ownership, regression cases, remediation evidence, and trend metrics.

## Stop conditions
Stop when feedback contains sensitive data that cannot be processed safely, source ownership is unavailable, or evidence is insufficient to distinguish among materially different root causes.