# Skill: Cost Anomaly Investigation

## Trigger
Unexpected cost/usage increase, budget alert, invoice variance, or service-owner escalation.

## Procedure
1. Confirm anomaly is real: currency, credits, late-arriving data, invoice corrections.
2. Establish expected baseline and materiality.
3. Decompose by account, service, region, SKU, owner, resource, and usage type.
4. Separate price, quantity, mix, and allocation effects.
5. Correlate deployments, scaling events, incidents, traffic, data growth, or policy changes.
6. Identify active financial leak vs legitimate business growth.
7. Contain only with safe, reversible actions unless human approval exists.
8. Quantify impact and remaining exposure.
9. Assign root-cause and prevention owners.
10. Close after billing evidence confirms stabilization.

## Stop conditions
Stop and escalate when containment could harm production or owner/authority is unclear.

## Output
Anomaly record with cause, impact, containment, owner, and prevention.
