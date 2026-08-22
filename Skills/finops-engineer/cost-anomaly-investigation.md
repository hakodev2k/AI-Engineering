# Cost Anomaly Investigation

## Purpose
Detect, explain, contain, and prevent unexpected cloud-spend changes using evidence rather than assuming every increase is waste.

## When to use
Use for budget alerts, daily cost spikes, unexplained service growth, or suspected billing defects.

## Inputs
Billing data, anomaly alert, deployment history, usage metrics, audit logs, architecture context, ownership metadata.

## Context to inspect
Inspect service, region, account, SKU, usage type, resource, deployment, scaling event, traffic, data transfer, commitments, and pricing changes.

## Core knowledge
Cost equals price multiplied by usage, modified by discounts and commitments. An anomaly can be legitimate demand, configuration drift, leaked resources, abusive traffic, pricing change, or accounting timing.

## Procedure
1. Establish baseline, magnitude, start time, and affected scope.
2. Decompose variance by billing dimensions.
3. Separate price effects from usage effects.
4. Correlate with deployments, scaling, traffic, jobs, and incidents.
5. Identify the smallest set of resources explaining most variance.
6. Confirm business legitimacy with owners.
7. Contain runaway spend when safe.
8. Quantify realized and projected impact.
9. Correct root cause and add detection or guardrails.
10. Record evidence and follow-up actions.

## Decision points
Contain immediately when spend is accelerating and rollback is low risk. Preserve capacity when the increase serves legitimate demand or reliability objectives.

## Common failure patterns
Comparing partial days to full days, ignoring seasonality, blaming a recent deployment without correlation, deleting resources before ownership confirmation, and treating discounts as usage reduction.

## Verification
The variance is quantitatively explained; owner confirms cause; containment does not violate SLOs; forecast returns to expected range or approved new baseline.

## Expected output
An anomaly timeline, cost decomposition, root cause, impact estimate, containment actions, and prevention measures.

## Stop conditions
Escalate before destructive action, customer-impacting capacity reduction, or when provider billing evidence is inconsistent.