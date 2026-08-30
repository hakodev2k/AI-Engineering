# Technical Risk Management

## Purpose
Identify, quantify, prioritize, and reduce technical risks that can threaten product delivery, reliability, security, cost, or future changeability.

## When to use
Use during roadmap planning, major migrations, platform changes, architecture reviews, or when latent technical debt is becoming operational risk.

## Inputs
Roadmap, architecture, incident history, debt inventory, security findings, capacity data, dependency map, delivery constraints.

## Preconditions
Risks can be tied to concrete systems or outcomes rather than vague concerns.

## Context to inspect
Failure history, unsupported dependencies, single points of failure, scaling limits, ownership gaps, compliance requirements, and operational toil.

## Core knowledge
Risk combines likelihood, impact, detectability, and time horizon. Not every risk should be eliminated; strong engineering makes risk explicit and chooses mitigation proportional to business exposure.

## Procedure
1. Collect risks from architecture, operations, security, and delivery perspectives.
2. Describe each risk as cause, failure scenario, and impact.
3. Score likelihood and impact with explicit assumptions.
4. Identify leading indicators and trigger thresholds.
5. Generate mitigation, transfer, avoidance, and acceptance options.
6. Estimate mitigation cost and residual risk.
7. Prioritize against roadmap value and urgency.
8. Assign owners and review dates.
9. Track material changes in exposure.

## Decision points
Mitigate high-impact irreversible risks early. Accept low-impact risk when mitigation cost exceeds exposure. Use staged experiments when likelihood is uncertain.

## Common failure patterns
Risk registers without owners, scoring by intuition alone, treating all debt as risk, ignoring time-to-failure, and silently accepting high-severity exposure.

## Verification
Confirm every material risk has evidence, an owner, a treatment decision, and a review trigger.

## Expected output
A prioritized technical risk register with mitigation plans, owners, thresholds, and accepted residual risk.

## Stop conditions
Escalate when risk acceptance exceeds engineering authority, involves regulatory/security sign-off, or threatens agreed business continuity limits.