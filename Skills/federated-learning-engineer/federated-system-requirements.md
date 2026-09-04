# Federated System Requirements

## Purpose
Turn privacy, data-locality, model-quality, and operational constraints into an implementable federated-learning (FL) specification.

## When to use
Use before designing a new FL system, replacing centralized training, or reviewing an existing deployment whose goals or constraints are unclear.

## Inputs
Business objective, data-location rules, client population, model target, privacy requirements, network constraints, device capabilities, deployment environment, and success metrics.

## Context to inspect
Inspect why data cannot be centralized, client ownership boundaries, participation frequency, trust assumptions, legal restrictions, training cadence, acceptable latency, and failure tolerance.

## Core knowledge
FL trades centralized data access for distributed optimization complexity. Senior design must separate hard constraints from preferences and distinguish privacy, confidentiality, data sovereignty, bandwidth, availability, and fairness requirements.

## Procedure
1. Define the target model behavior and baseline.
2. Identify all data owners and trust boundaries.
3. Classify mandatory versus optional data-locality constraints.
4. Quantify client population, availability, compute, memory, and bandwidth.
5. Define participation, scheduling, and training cadence.
6. Specify privacy, security, and audit requirements.
7. Define acceptable model-quality loss versus centralized training.
8. Establish reliability, cost, and operational SLOs.
9. Record regulatory or contractual constraints.
10. Define measurable go/no-go criteria.

## Decision points
Use FL only when decentralization materially solves a real constraint. Prefer centralized learning when data can be governed centrally without unacceptable risk or cost. Consider split learning or secure aggregation only when their extra complexity is justified.

## Common failure patterns
- Treating FL as automatically privacy-preserving.
- Ignoring client resource heterogeneity.
- Undefined trust model.
- No centralized or local baseline.
- Requirements that contradict feasible participation rates.

## Verification
Confirm every major design choice maps to an explicit requirement and each success criterion has a measurable test.

## Expected output
A federated-learning requirements specification with constraints, assumptions, metrics, baselines, risks, and acceptance criteria.

## Stop conditions
Stop if the reason for federation is unproven, required privacy guarantees cannot be stated, or client/platform constraints are unknown.