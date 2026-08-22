# Workflow: Technical Escalation

## Trigger
Customer issue cannot be resolved within Customer Success ownership or requires Engineering, Support, Security, Product, or another specialist.

## Goal
Transfer a complete, prioritized, reproducible problem without losing context or making unsupported claims.

## Stages
1. Triage severity and impact.
2. Gather expected/actual behavior, timestamps, environment, version, recent changes, request IDs, logs, reproduction, and workaround status.
3. Integration Investigator tests safe hypotheses in parallel with documentation/known-issue review.
4. Primary role separates facts, hypotheses, and unknowns.
5. Produce `templates/escalation-packet.md` with explicit decision/action requested.
6. Risk Reviewer checks severity, security/privacy exposure, and cost of delay.
7. Handoff to accountable team and set next checkpoint.
8. Keep customer updated using verified information only.
9. After fix/workaround, verify original path and customer outcome.

## Review point
Before escalation and before declaring resolution.

## Retry policy
Maximum two equivalent diagnostic attempts; repeated failure becomes an explicit blocker.

## Escalation
Security/privacy concerns immediately route to the security owner. Production-severity issues use incident process when available.

## Definition of Done
Receiving owner accepts the packet; customer communication is accurate; resolution or next owner is known; verification evidence is recorded.