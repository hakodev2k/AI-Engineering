# Trust, Reliance, and Calibration

## Purpose
Study whether users rely on AI appropriately relative to its actual capability and uncertainty, rather than maximizing subjective trust.

## When to use
Use when AI recommendations, generated content, autonomous actions, or decision support can produce meaningful costs from over-reliance or under-reliance.

## Inputs
System performance evidence, task stakes, user groups, interaction design, uncertainty signals, error cases, and research questions.

## Context to inspect
Review model evaluations, error distributions, explanations, confidence cues, verification affordances, automation level, user expertise, and consequences of acceptance or rejection.

## Core knowledge
Trust is not the goal; calibrated reliance is. Appropriate reliance depends on user ability to recognize when the system is likely to help, when verification is needed, and when to override it. Aggregate accuracy can conceal dangerous conditional failures.

## Procedure
1. Define what appropriate reliance means for the task.
2. Identify situations where accepting AI output is beneficial, neutral, or harmful.
3. Build scenarios spanning strong performance, uncertainty, and representative failures.
4. Measure acceptance, rejection, verification, correction, and confidence.
5. Compare user reliance with empirical system performance by condition.
6. Examine whether explanations or confidence cues improve discrimination rather than merely increasing acceptance.
7. Test how prior successes and failures alter subsequent reliance.
8. Segment results by expertise and AI familiarity.
9. Identify costly over-reliance and costly under-reliance patterns.
10. Recommend changes to cues, workflow, permissions, or verification requirements.

## Decision points
Use forced-choice tasks for controlled discrimination; use realistic workflows when verification cost matters. Add friction for consequential actions when calibration cannot be achieved through information alone.

## Common failure patterns
Using a single trust Likert score, assuming higher trust is better, evaluating only average model accuracy, confusing confidence with correctness, and ignoring user verification effort.

## Verification
Demonstrate whether users discriminate between conditions of differing system reliability and whether proposed design changes improve joint outcomes without unacceptable workload.

## Expected output
A calibration analysis showing reliance behavior, mismatch conditions, contributing interface factors, risk severity, and actionable mitigations.

## Stop conditions
Stop when system reliability by relevant condition is unknown, task consequences cannot be characterized, or the study would expose participants to unacceptable real-world harm.