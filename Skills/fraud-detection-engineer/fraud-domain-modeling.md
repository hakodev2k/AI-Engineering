# Fraud Domain Modeling

## Purpose
Translate fraud risks into explicit entities, events, decisions, labels, loss concepts, and measurable controls so detection systems solve the right problem.

## When to use
Use when starting a fraud program, adding a fraud type, changing a decision flow, or reviewing ambiguous detection requirements. Do not jump directly to model selection before this model is clear.

## Inputs
- Product and payment flows
- Known fraud scenarios
- Historical cases and losses
- Decision points and operational constraints
- Regulatory or policy requirements

## Context to inspect
Inspect event schemas, account and transaction lifecycles, authentication steps, case outcomes, refunds, disputes, chargebacks, manual-review states, and existing reason codes.

## Core knowledge
Fraud is adversarial and outcome labels are often delayed or incomplete. Distinguish attempted fraud, confirmed fraud, abuse, credit risk, policy violations, and customer error. Model exposure, prevented loss, realized loss, false-positive cost, and review cost separately.

## Procedure
1. Map actors, assets, channels, events, and decision points.
2. Enumerate fraud typologies and attacker objectives.
3. Define what constitutes a positive, negative, unknown, and disputed outcome.
4. Define loss and customer-friction metrics.
5. Identify controllable versus observable signals.
6. Map each control to prevention, detection, or investigation.
7. Define reason-code and audit requirements.
8. Document assumptions and unresolved label ambiguity.

## Decision points
Separate fraud types when their signals, costs, or controls differ materially. Combine them only when a shared decision policy remains meaningful.

## Common failure patterns
- Treating all bad outcomes as fraud
- Mixing credit risk with fraud risk
- Ignoring delayed labels
- Optimizing detection rate without customer cost
- Failing to model unknown outcomes

## Verification
Validate the model with investigators, product owners, risk stakeholders, and historical cases. Confirm metrics can be computed from available data.

## Expected output
A reusable fraud domain map with entities, fraud types, decisions, outcomes, loss definitions, and control boundaries.

## Stop conditions
Stop when legal definitions, loss ownership, or outcome semantics are materially unresolved.