# Showback and Chargeback

## Purpose
Design transparent AI cost showback or chargeback so teams understand the economic consequences of their workloads and can act on them.

## When to use
Use when shared AI platforms, GPU clusters, model APIs, or data services serve multiple teams and central spend hides local consumption.

## Inputs
- Allocated cost data
- Ownership hierarchy
- Finance policies
- Usage telemetry
- Shared-service cost pools
- Budget structures

## Context to inspect
Inspect team boundaries, platform ownership, internal pricing rules, discount handling, idle capacity, shared observability, and organization-specific cost-center requirements.

## Core knowledge
Showback informs without transferring budget; chargeback transfers financial responsibility. Both require credible allocation, stable definitions, and reconciliation. Internal pricing should not create incentives that undermine platform reliability or efficient shared usage.

## Procedure
1. Define the behavioral goal of showback or chargeback.
2. Confirm allocation coverage and reconciliation quality.
3. Agree cost ownership and hierarchy with finance.
4. Separate direct, shared, commitment, and idle costs.
5. Define internal rate or allocation policy where needed.
6. Publish drill-down views from total cost to workload drivers.
7. Provide month-over-month variance explanations.
8. Establish dispute and correction processes.
9. Pilot with a small set of teams before financial enforcement.
10. Track whether teams respond with productive optimization actions.
11. Review internal rates when provider pricing or architecture changes.

## Decision points
Start with showback when allocation maturity or organizational trust is low. Move to chargeback only when cost data is sufficiently accurate and finance supports the policy.

## Common failure patterns
Opaque shared-cost formulas, surprise chargeback, internal rates disconnected from actual economics, and penalizing teams for platform-controlled idle capacity.

## Verification
Reconcile totals, sample traceability from invoice to workload, and confirm teams can explain their major cost drivers.

## Expected output
A showback/chargeback policy, internal cost model, team views, dispute process, and reconciliation evidence.

## Stop conditions
Stop if allocation quality is inadequate for the intended financial consequence or if finance has not approved chargeback rules.