# AI Use Case Assessment

## Purpose
Evaluate whether a proposed use case is suitable for AI, what level of autonomy is appropriate, and what evidence is needed before investment.

## When to use
Use during portfolio intake, discovery, architecture review, or when replacing a deterministic workflow with AI.

## Inputs
Use-case description, users, task frequency, business impact, error cost, data availability, baseline process, expected scale, and policy constraints.

## Preconditions
The intended outcome and current baseline are known well enough to compare alternatives.

## Context to inspect
Inspect representative tasks, edge cases, existing automation, data quality, failure consequences, human review capacity, and integration dependencies.

## Core knowledge
AI suitability depends on task ambiguity, tolerance for probabilistic output, evaluation feasibility, data quality, reversibility, and operational controls. High-value does not automatically mean high-autonomy.

## Procedure
1. Classify the task as generation, extraction, classification, search, recommendation, prediction, planning, or action.
2. Measure current cost, quality, latency, and failure rate.
3. Identify what AI adds beyond deterministic logic.
4. Estimate error severity and reversibility.
5. Determine whether quality can be evaluated objectively or with reliable human judgment.
6. Assess data readiness and privacy constraints.
7. Define the minimum acceptable model capability.
8. Select assistive, supervised, or autonomous operation.
9. Compare build, buy, and non-AI alternatives.
10. Recommend proceed, prototype, defer, or reject with evidence gaps.

## Decision points
Use assistive AI when human judgment remains central. Use supervised automation when outputs are reviewable. Use autonomy only when actions are bounded, recoverable, observable, and policy-approved.

## Common failure patterns
Choosing use cases because they are visible rather than valuable, ignoring evaluation cost, underestimating human review burden, and assuming model capability equals production suitability.

## Verification
A reviewer can trace the recommendation to measurable value, risk, feasibility, evaluation, and operational readiness.

## Expected output
A scored use-case assessment with recommendation, autonomy level, baseline, risks, evidence gaps, and next validation step.

## Stop conditions
Stop when the use case has unacceptable irreversible risk, no viable evaluation method, prohibited data use, or no meaningful advantage over deterministic software.