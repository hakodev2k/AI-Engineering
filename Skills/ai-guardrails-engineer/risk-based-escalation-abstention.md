# Risk-Based Escalation and Abstention

## Purpose
Define proceed, clarify, constrain, abstain, and escalate behavior based on uncertainty and consequence.

## When to use
Use when ambiguity, classifier uncertainty, incomplete authorization, or impact make binary decisions insufficient.

## Inputs
Risk taxonomy, confidence, impact, reversibility, context, approval, objectives.

## Context to inspect
Inspect calibration, categories, alternatives, review capacity, UX, ownership.

## Core knowledge
Combine uncertainty with consequence/reversibility; abstention should lead to a useful safe state.

## Procedure
1. Classify consequence/reversibility.
2. Identify calibrated signals.
3. Define decision bands.
4. Define safe behavior.
5. Include escalation evidence.
6. Define overload behavior.
7. Prevent retry bypass.
8. Test boundaries.
9. Monitor review yield.
10. Recalibrate.

## Decision points
Escalate high-impact uncertainty, clarify resolvable intent, abstain with no safe authorized path.

## Common failure patterns
Uncalibrated confidence, excessive review, retry-until-allowed, poor escalation context.

## Verification
Measure safety and review burden on labeled/shadow traffic.

## Expected output
Calibrated escalation policy.

## Stop conditions
Restrict unresolved high-risk uncertainty.