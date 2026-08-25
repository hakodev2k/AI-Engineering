# Interaction and Feedback Data Design

## Purpose
Design trustworthy behavioral data for recommendation training, evaluation, and monitoring.

## When to use
Use when defining events, adding a recommendation surface, changing logging, or investigating data quality.

## Inputs
UI flows, serving logs, event schemas, identity model, consent rules, and downstream feature/label requirements.

## Context to inspect
Exposure logging, event timestamps, request IDs, item/user IDs, position, model version, consent state, deduplication, and retention.

## Core knowledge
Clicks are not exposures; absence of interaction is not automatically a negative. Training examples require causal ordering, point-in-time correctness, and traceability from impression to outcome.

## Procedure
1. Enumerate exposure, interaction, conversion, dismissal, and terminal events.
2. Define stable identifiers and correlation keys.
3. Record rank position, candidate source, scores, policy/model version, and timestamp.
4. Specify attribution windows and deduplication.
5. Define positive, negative, censored, and unknown labels.
6. Validate consent and minimization requirements.
7. Build freshness, completeness, uniqueness, and join-rate checks.
8. Backfill only when historical semantics are compatible.

## Decision points
Use explicit feedback when meaningful but sparse; implicit feedback when abundant but biased. Choose attribution windows from product semantics, not convenience.

## Common failure patterns
Missing exposure logs, future leakage, duplicated events, clock skew, mutable identifiers, silent schema changes, and treating unobserved items as negatives.

## Verification
Replay sampled sessions end-to-end, reconcile event counts, test joins, inspect label distributions by cohort, and verify point-in-time ordering.

## Expected output
Versioned event and label contracts with quality checks and documented attribution semantics.

## Stop conditions
Stop if identity, consent, exposure semantics, or event ordering cannot be established reliably.