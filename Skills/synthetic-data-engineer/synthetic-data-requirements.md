# Synthetic Data Requirements

## Purpose
Define why synthetic data is needed, what populations it must represent, and what quality, privacy, fidelity, and operational constraints apply before generation work begins.

## When to use
Use when creating synthetic data for ML training, testing, privacy-preserving analytics, simulation, rare-event coverage, or data augmentation.

## Inputs
Use case, downstream task, real-data samples, schema, sensitive attributes, target distributions, acceptance criteria, regulatory constraints.

## Preconditions
Confirm the business objective, downstream consumer, and whether synthetic data is allowed for the intended use.

## Context to inspect
Source datasets, data contracts, labels, missingness, class imbalance, privacy risks, model metrics, validation pipelines, and deployment environment.

## Core knowledge
Synthetic data quality is task-dependent. Statistical resemblance alone is insufficient; utility, coverage, privacy leakage, structural validity, and downstream performance must be measured separately.

## Procedure
1. Define the downstream decision or model task.
2. Identify populations and edge cases that require coverage.
3. Separate fidelity, utility, diversity, and privacy goals.
4. Define prohibited memorization or leakage.
5. Specify schema and semantic constraints.
6. Define train/validation/test isolation requirements.
7. Set quantitative acceptance metrics.
8. Document risk thresholds and human review needs.
9. Record generation cost and latency limits.
10. Produce a requirements contract.

## Decision points
Prefer synthetic augmentation when real data exists but coverage is weak. Prefer fully synthetic datasets only when privacy, scarcity, or simulation requirements justify the larger validation burden.

## Common failure patterns
Optimizing visual/statistical similarity without downstream utility; ignoring minority populations; leaking real records; undefined labels; validating only aggregate metrics.

## Verification
Verify that requirements map to measurable tests and that representative stakeholders agree on acceptable failure thresholds.

## Expected output
A synthetic-data requirements specification with utility, privacy, fidelity, coverage, and operational criteria.

## Stop conditions
Stop when intended use, sensitive-data policy, or acceptance metrics are unresolved.