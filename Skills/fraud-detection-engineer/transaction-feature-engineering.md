# Transaction Feature Engineering

## Purpose
Design leakage-safe, low-latency, behaviorally meaningful features for fraud detection across transactions, accounts, devices, merchants, and networks.

## When to use
Use when building or revising model inputs, rules, monitoring signals, or online scoring data. Do not create features without confirming event-time semantics and serving feasibility.

## Inputs
- Event and entity schemas
- Historical labeled data
- Online latency budget
- Feature-store or serving architecture
- Known fraud patterns

## Context to inspect
Inspect timestamps, entity identifiers, aggregation windows, late-arriving events, missing values, source reliability, online/offline computation differences, and privacy constraints.

## Core knowledge
Fraud features often rely on velocity, recency, novelty, consistency, peer comparison, device/account linkage, and sequence behavior. Point-in-time correctness is mandatory; post-outcome data creates leakage.

## Procedure
1. Define the decision timestamp and available information boundary.
2. Group candidate signals by entity and fraud hypothesis.
3. Create velocity, recency, count, amount, diversity, and change features where justified.
4. Add cross-entity relationship and novelty indicators.
5. Specify windows and late-data behavior.
6. Check feature cardinality, sparsity, missingness, and stability.
7. Guarantee point-in-time joins for training.
8. Reproduce online computation from offline data.
9. Measure incremental predictive value and serving cost.
10. Version feature definitions and dependencies.

## Decision points
Prefer simple stable aggregates when they capture the behavior. Use complex sequence or graph-derived features only when measurable lift justifies latency and operational cost.

## Common failure patterns
- Label leakage through future events
- Training/serving skew
- Unbounded high-cardinality features
- Features dependent on unreliable identifiers
- Ignoring missingness as a signal

## Verification
Run point-in-time audits, offline/online parity checks, backtests, missingness analysis, latency tests, and feature-ablation comparisons.

## Expected output
A versioned feature specification with semantics, windows, computation path, dependencies, and validation evidence.

## Stop conditions
Stop when timestamps or entity identities are too unreliable to guarantee causal feature construction.