# Payment Fraud Controls

## Purpose
Integrate fraud controls without confusing fraud decisions with payment correctness or creating uncontrolled customer friction.

## When to use
Use when adding risk scoring, velocity controls, step-up authentication, manual review, or fraud-provider integrations.

## Inputs
Fraud scenarios, risk signals, loss data, approval targets, provider capabilities, privacy constraints.

## Context to inspect
Checkout/payment flow, identity signals, device/network data, chargebacks, rule engine, model outputs, review tooling.

## Core knowledge
Fraud prevention is a cost-sensitive classification problem with asymmetric errors. Controls need measurable precision/recall-like outcomes, latency budgets, explainability sufficient for operations, and safe fallbacks when risk systems fail.

## Procedure
1. Define fraud/loss objectives and acceptable customer friction.
2. Map available signals and their provenance.
3. Remove prohibited or unjustified data use.
4. Establish baseline approval, fraud, and false-positive rates.
5. Separate deterministic safety rules from probabilistic scoring.
6. Define allow, deny, challenge, and review thresholds.
7. Set latency/timeouts and failure fallback.
8. Version rules/models and decision reasons.
9. Prevent attackers from learning overly specific decision logic.
10. Monitor outcomes by cohort and payment rail.
11. Feed confirmed disputes/fraud back with leakage-safe labels.
12. Roll out changes gradually with rollback criteria.

## Decision points
Fail-open versus fail-closed depends on transaction risk, regulatory constraints, and loss tolerance; document the choice explicitly.

## Common failure patterns
Optimizing fraud rate alone, blocking good customers, using post-outcome data during training, unbounded rule growth, and no degraded mode.

## Verification
Backtest on historical data, shadow new controls, measure approval/loss/friction, test outages, and verify decision auditability.

## Expected output
A measurable fraud-control design with thresholds, fallback behavior, monitoring, and controlled rollout.

## Stop conditions
Escalate material policy, privacy, discrimination, or regulatory concerns.