# Experimentation Rules

## Purpose
Ensure product experiments produce decision-quality evidence without exposing users to uncontrolled risk.

## Scope
Applies to A/B tests, staged rollouts, pilots, shadow tests, and feature experiments.

## MUST
- Every experiment MUST state a hypothesis, primary metric, guardrails, target population, duration logic, and decision rule before exposure begins.
- Experiments with safety, privacy, financial, or legal impact MUST use bounded exposure and pre-approved stop conditions.
- Results MUST report uncertainty and relevant segment effects, not only aggregate lift.
- Experiment instrumentation MUST be validated before interpreting outcomes.

## MUST NOT
- MUST NOT repeatedly peek and stop when results become favorable without a pre-defined sequential method.
- MUST NOT continue an experiment after a guardrail breach that requires termination.
- MUST NOT characterize correlation from uncontrolled rollout as causal evidence.

## SHOULD
- Small pilots SHOULD retire feasibility or workflow uncertainty before broad controlled experiments.
- Negative and neutral results SHOULD be retained to reduce repeated failed exploration.

## Exceptions
Exceptions require documented methodology limits, decision risk, and follow-up evidence requirements.

## Verification
Inspect experiment specifications, exposure controls, telemetry validation, analysis notebooks or reports, guardrail outcomes, and final decisions.