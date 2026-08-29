# AI Evaluation Strategy

## Purpose
Build an evaluation system that measures whether AI behavior is good enough for real users and safe enough for production.

## When to use
Use before launch, model or prompt changes, retrieval changes, fine-tuning, or when user-reported quality conflicts with offline metrics.

## Inputs
User tasks, failure reports, representative data, acceptance criteria, risk classes, current prompts/models, production metrics.

## Context to inspect
Existing eval datasets, graders, human review practices, traffic segments, edge cases, safety policies, and change history.

## Core knowledge
AI quality is distributional rather than binary. Strong evaluation combines task-specific offline evals, human judgment where needed, deterministic checks, regression suites, and online outcomes.

## Procedure
1. Define critical user tasks and failure categories.
2. Create representative examples including difficult and adversarial cases.
3. Choose metrics aligned with user value: correctness, groundedness, completeness, tool success, format adherence, safety, or preference.
4. Use deterministic graders where possible and calibrated human/model graders where necessary.
5. Establish baseline scores and launch thresholds.
6. Add regression cases from production failures.
7. Segment results by user, language, task, risk, and input type.
8. Define online metrics to validate offline findings.
9. Require evaluation before material AI behavior changes.

## Decision points
Use human evaluation for subjective or high-stakes dimensions. Use automated graders for scale only after validating grader reliability.

## Common failure patterns
Tiny golden sets, benchmark-only evaluation, unvalidated LLM judges, aggregate metrics hiding severe segments, and changing prompts without regression testing.

## Verification
Check inter-rater agreement where applicable, reproduce baseline scores, and demonstrate that known bad changes fail the evaluation gate.

## Expected output
An evaluation framework with datasets, metrics, graders, thresholds, segmentation, and release gates.

## Stop conditions
Stop when representative data cannot legally or safely be used or when success criteria cannot be operationalized.