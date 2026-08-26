# Model Extraction Defense

## Purpose
Assess and reduce the risk that an external party can reconstruct model behavior, steal valuable capabilities, or build a high-fidelity substitute through inference access.

## When to use
Use for valuable proprietary models, paid inference APIs, high-query-volume services, or suspected scraping/extraction.

## Inputs
API behavior, model sensitivity, query logs, pricing/rate controls, output fields, threat model, and business impact.

## Preconditions
Define legitimate usage patterns and what model information is considered sensitive.

## Context to inspect
Inspect confidence scores, logits, explanations, batch APIs, quotas, anonymous access, account creation, caching, and model versioning.

## Core knowledge
Extraction economics depend on query access, output richness, target task, model complexity, and attacker budget. Defenses can reduce utility for legitimate users, so controls should be proportional and layered.

## Procedure
1. Define the extraction objective and protected model value.
2. Characterize public inputs and output information exposed.
3. Establish normal query-volume and diversity baselines.
4. Simulate feasible extraction under approved test accounts.
5. Estimate attacker cost and resulting substitute fidelity.
6. Reduce unnecessary output precision or metadata.
7. Apply identity-aware quotas, rate limits, and abuse detection.
8. Detect systematic coverage, boundary probing, and distributed-account patterns.
9. Evaluate watermarking/fingerprinting only if it supports a concrete enforcement workflow.
10. Measure user-impact and false positives.
11. Add monitoring and response playbooks.

## Decision points
Do not hide outputs needed for product correctness merely for theoretical secrecy. Prefer account/behavior controls when extraction requires scale. Use output reduction when information is unnecessary to consumers.

## Common failure patterns
Relying only on per-IP rate limits; exposing full probability vectors without need; assuming a watermark prevents theft; blocking research-like traffic without false-positive analysis; ignoring distributed extraction.

## Verification
Run extraction simulations before and after controls, verify materially increased attacker cost or reduced fidelity, test legitimate high-volume clients, and confirm alerts contain actionable identity/query evidence.

## Expected output
An extraction-risk assessment with measured attack economics, selected controls, monitoring, and residual-risk decision.

## Stop conditions
Stop if testing would violate customer boundaries, production load safety is uncertain, or mitigation would materially alter contracted API behavior without approval.