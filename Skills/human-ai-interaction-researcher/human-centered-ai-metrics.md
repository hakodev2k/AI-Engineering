# Human-Centered AI Metrics

## Purpose
Define metrics that evaluate the joint human-AI system, including task value, effort, verification, recovery, calibration, and downstream consequences rather than model performance alone.

## When to use
Use when establishing product success criteria, study outcomes, dashboards, experiments, or launch gates for AI experiences.

## Inputs
User goals, task definition, model evaluations, product metrics, risks, workflow, decision criteria, and available instrumentation.

## Context to inspect
Review current KPIs, task success definitions, user segments, error costs, system latency, verification workflow, adoption incentives, and model-quality measures.

## Core knowledge
Model accuracy and user satisfaction can diverge from joint performance. Metrics should distinguish outcome quality, process cost, reliance behavior, recoverability, and distributional effects. Proxy metrics require validation against the user outcome they represent.

## Procedure
1. Define the user and organizational outcome the AI is intended to improve.
2. Map the end-to-end task and identify measurable success states.
3. Separate model-level, interaction-level, task-level, and downstream metrics.
4. Add effort measures such as time, revisions, verification, and recovery.
5. Add risk measures for consequential errors and inappropriate reliance.
6. Define denominator and unit of analysis precisely.
7. Segment metrics where averages could hide important disparities.
8. Validate proxies against direct outcome evidence.
9. Set thresholds or decision rules based on practical significance and risk.
10. Monitor for gaming, metric substitution, and behavior changes after launch.

## Decision points
Prefer task outcomes over engagement when they conflict. Use composite metrics only when components and weights have defensible meaning. Track severe failures separately rather than averaging them into quality scores.

## Common failure patterns
Using usage as value, optimizing acceptance rate, averaging away severe errors, ambiguous denominators, unvalidated satisfaction scales, and treating offline model scores as user outcomes.

## Verification
Trace every metric to a user or operational objective and validate calculations against representative raw cases. Confirm decision thresholds reflect real consequences.

## Expected output
A metric framework with definitions, units, instrumentation needs, segmentation, thresholds, risks, and validation evidence.

## Stop conditions
Stop when the intended user outcome is undefined, available data cannot validly represent the construct, or metric use would incentivize unsafe behavior.