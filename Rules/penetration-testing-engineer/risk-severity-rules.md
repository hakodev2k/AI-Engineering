# Risk and Severity Rules

## Purpose
Assign severity from demonstrated security impact and realistic exploitation conditions rather than tool labels or intuition.

## Scope
Covers finding prioritization, exploitability analysis, business impact, chaining, and remediation urgency.

## MUST
- MUST distinguish technical severity, likelihood, exposure, prerequisites, affected population, and business consequence.
- MUST base material impact claims on evidence or clearly labeled assumptions.
- MUST account for existing compensating controls that materially change exploitability or impact.
- MUST explain attack prerequisites and the realistic attacker position required.
- MUST reassess severity when multiple individually limited findings form a credible attack chain.

## MUST NOT
- MUST NOT copy scanner severity blindly into the final report.
- MUST NOT inflate severity to gain attention or suppress severity to avoid stakeholder discomfort.
- MUST NOT claim catastrophic impact when only a bounded condition was demonstrated and the escalation path is speculative.
- MUST NOT hide uncertainty in scoring precision.

## SHOULD
- SHOULD use the engagement's agreed scoring framework consistently.
- SHOULD prioritize remediation based on risk reduction, not numerical score alone.

## Exceptions
Departures from the standard scoring model require documented rationale, evidence, and reviewer agreement.

## Verification
Review evidence, prerequisites, scoring inputs, compensating controls, affected scope, attack-chain analysis, and peer-review comments. Confirm the narrative and numeric severity are consistent.