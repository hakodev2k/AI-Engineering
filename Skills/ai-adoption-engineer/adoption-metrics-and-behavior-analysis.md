# Adoption Metrics and Behavior Analysis

## Purpose
Measure whether users are adopting an AI capability in ways that create durable value rather than merely generating usage.

## When to use
Use during pilots and production rollout when teams need to distinguish exposure, experimentation, habitual use, successful task completion, and harmful dependency.

## Inputs
User journeys, telemetry, task definitions, baseline workflow metrics, user segments, support data, and business outcomes.

## Context to inspect
Inspect event instrumentation, active-user definitions, task completion, repeat use, corrections, abandonment, overrides, support incidents, and segment differences.

## Core knowledge
Adoption is behavioral. Login counts and prompt volume can increase while value falls. Strong measurement connects usage to target tasks, successful outcomes, quality, time saved, and downstream effects.

## Procedure
1. Define the target behavior for each user segment.
2. Separate access, trial, repeat use, proficient use, and workflow dependence.
3. Instrument task-level events rather than only session counts.
4. Measure completion, correction, abandonment, and fallback behavior.
5. Compare behavior against the pre-AI baseline.
6. Segment results by role, tenure, task type, and risk level.
7. Identify friction points and misuse patterns.
8. Combine telemetry with qualitative evidence where intent is ambiguous.
9. Track leading indicators and durable outcome indicators separately.
10. Recommend product, training, or workflow changes based on evidence.

## Decision points
Use behavioral telemetry for scale and qualitative research for explaining why. Avoid declaring success from volume metrics unless higher volume is itself the business outcome.

## Common failure patterns
Counting prompts as adoption, ignoring abandoned attempts, averaging across dissimilar users, and treating mandatory use as evidence of value.

## Verification
Metric definitions must be reproducible and tied to specific user outcomes. Sample sessions should reconcile with aggregate measures.

## Expected output
An adoption measurement model, dashboards, segment analysis, friction findings, and evidence-backed interventions.

## Stop conditions
Stop when telemetry cannot distinguish target tasks or when privacy rules prohibit the required measurement without an approved alternative.