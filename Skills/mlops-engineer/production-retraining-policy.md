# Production Retraining Policy

## Purpose
Define when, why, and how production models retrain so freshness improves without uncontrolled churn, feedback loops, or degraded quality.

## When to use
Use for recurring, event-triggered, or drift-triggered retraining systems.

## Inputs
Model decay profile, label delay, data volume, drift signals, training cost, validation gates, business seasonality, risk tier.

## Preconditions
A stable baseline model and reproducible training pipeline exist.

## Context to inspect
Historical retraining outcomes, drift incidents, data arrival patterns, label quality, compute capacity, registry, and deployment gates.

## Core knowledge
Retraining is a change-production mechanism. Newer data is not automatically better; feedback loops, label delay, anomalous windows, and selection bias can make frequent retraining harmful.

## Procedure
1. Quantify historical performance decay and data change.
2. Choose time-, volume-, event-, or evidence-based triggers.
3. Define training window and exclusion rules.
4. Validate data quality before training.
5. Train from immutable inputs and code.
6. Compare candidate against current baseline and critical slices.
7. Require operational benchmarks and registry evidence.
8. Deploy through controlled rollout.
9. Record trigger, evidence, and outcome.
10. Periodically review whether cadence remains justified.

## Decision points
Scheduled retraining for predictable decay; drift-triggered retraining only when drift-quality relationship is understood; manual review for high-impact models.

## Common failure patterns
Retraining on corrupted recent data, automatic replacement on tiny metric gains, feedback-loop amplification, test-set reuse, and cadence chosen without decay evidence.

## Verification
Backtest the policy on historical periods and measure false retrain triggers, missed degradation, cost, and resulting quality.

## Expected output
Trigger policy, data-window rules, validation gates, deployment path, and review cadence.

## Stop conditions
Disable automatic retraining when labels degrade, drift cause is ambiguous, or repeated candidates fail to outperform safely.