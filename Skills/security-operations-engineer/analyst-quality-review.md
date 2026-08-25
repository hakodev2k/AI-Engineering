# Analyst Investigation Quality Review

## Purpose
Improve consistency and evidentiary quality of SOC investigations through structured peer review without reducing work to closure-volume scoring.

## When to use
Use for case sampling, coaching, process improvement and validating new workflows.

## Inputs
Closed cases, runbooks, severity policy, evidence standards, disposition taxonomy and incident outcomes.

## Context to inspect
Account for case complexity, telemetry availability and shift conditions before judging analyst decisions.

## Core knowledge
Quality review should assess reasoning, evidence, scope, escalation and reproducibility. It should distinguish process defects from individual mistakes.

## Procedure
1. Select representative cases using risk-based sampling.
2. Check trigger reconstruction and entity identification.
3. Verify evidence supports the disposition.
4. Review whether alternative hypotheses were reasonably tested.
5. Check scope expansion and stopping logic.
6. Validate severity and escalation decisions.
7. Review evidence preservation and case notes.
8. Identify runbook, tooling or telemetry contributors to errors.
9. Provide specific coaching and systemic actions.
10. Track recurring quality themes over time.

## Decision points
Increase sampling for high-severity or newly introduced workflows. Avoid penalizing justified escalation under uncertainty.

## Common failure patterns
Scoring only speed; hindsight bias; treating runbook compliance as correctness; ignoring missing telemetry; feedback without examples.

## Verification
Review criteria are applied consistently, findings are reproducible and recurring systemic issues receive owners.

## Expected output
Quality findings with coaching points, process improvements and trend metrics.

## Stop conditions
Escalate when review discovers an unreported incident, material evidence-handling breach or systemic unsafe procedure.