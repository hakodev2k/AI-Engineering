# Safety-Aware Routing

## Purpose
Route requests according to safety risk, model capability, policy requirements, and escalation needs without allowing optimization goals to bypass safeguards.

## When to use
Use when workloads vary in sensitivity, models have different safety profiles, or policies require specialized handling for high-risk content.

## Inputs
Safety taxonomy, request classification signals, model safety evaluations, policy rules, moderation controls, escalation paths.

## Context to inspect
Existing moderation layers, provider safety settings, refusal behavior, tool permissions, user tier, jurisdiction, and incident history.

## Core knowledge
Safety eligibility is a hard constraint. Routing can improve risk handling by sending sensitive tasks to models with stronger controls, but classification itself can fail and must be conservative for high-impact domains.

## Procedure
1. Define safety-relevant traffic classes.
2. Map each class to permitted models and tool capabilities.
3. Apply input moderation or policy classification before model preference scoring.
4. Define stricter thresholds for high-impact actions.
5. Disable unsafe fallback paths.
6. Add human review or abstention where no route meets policy.
7. Preserve decision reasons and policy versions.
8. Red-team routing boundaries and fallback behavior.
9. Monitor safety incidents by route and model version.

## Decision points
Prefer abstention over routing to a weaker safeguard profile. Use specialized models only when their evaluated risk performance justifies the complexity.

## Common failure patterns
Treating safety as a scoreable preference, fallback bypass, relying only on provider defaults, unsafe tool permission inheritance, and stale risk classifications.

## Verification
Verify adversarial tests, prohibited-route tests, escalation behavior, and route-specific incident metrics.

## Expected output
A safety routing matrix with hard eligibility rules, escalation logic, and test evidence.

## Stop conditions
Stop when safety policy ownership is unclear or candidate models lack sufficient risk evaluation.