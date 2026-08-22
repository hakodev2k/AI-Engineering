# Production Feedback Loop

## Purpose
Establish a repeatable loop from released behavior to telemetry, user feedback, support signals, product learning, and backlog decisions.

## When to use
Use for every meaningful release, especially new workflows, experiments, performance changes, and operationally sensitive features.

## Inputs
Release scope, product metrics, logs or operational summaries, analytics, support feedback, research signals, and expected outcomes.

## Context to inspect
Inspect baseline behavior, instrumentation coverage, target segments, rollout exposure, incident signals, and known limitations.

## Core knowledge
Delivery creates evidence; it does not finish product thinking. Product Owners should compare observed outcomes with hypotheses and distinguish adoption, usability, reliability, and value problems.

## Procedure
1. Record expected outcome before release.
2. Confirm required instrumentation and feedback channels exist.
3. Establish baseline and observation window.
4. Monitor guardrails during rollout.
5. Compare actual behavior with expected behavior.
6. Segment surprising results.
7. Combine quantitative signals with qualitative feedback.
8. Identify whether the issue is value, usability, discoverability, quality, or operations.
9. Decide to expand, improve, rollback, investigate, or stop.
10. Update goals, backlog, and assumptions with the evidence.

## Decision points
Expand exposure when outcome and guardrails are healthy; investigate when evidence conflicts; rollback when harm or critical regressions exceed tolerance.

## Common failure patterns
No baseline, dashboards without decisions, cherry-picking positive feedback, measuring immediately when behavior needs time, and leaving temporary rollout controls forever.

## Verification
Post-release evidence is reviewed against pre-release expectations and results in an explicit product decision.

## Expected output
A closed learning loop connecting release evidence to the next product action.

## Stop conditions
Escalate when telemetry suggests security, privacy, safety, data integrity, or severe reliability incidents.