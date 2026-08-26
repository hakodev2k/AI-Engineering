# Model Extraction and Intellectual Property Abuse

## Purpose
Evaluate exposure to systematic replication of model behavior, proprietary prompts, decision logic, or protected artifacts through permitted interfaces.

## When to use
Use for externally reachable AI APIs or products where model behavior, fine-tuning, prompts, or proprietary datasets have material value.

## Inputs
API limits, output formats, pricing, authentication, telemetry, model architecture assumptions, acceptable-use policy, and synthetic test accounts.

## Context to inspect
Review query quotas, account linkage, streaming/batch interfaces, confidence/logit exposure, caching, error messages, and abuse detection.

## Core knowledge
Extraction risk grows with query volume, rich outputs, deterministic behavior, weak identity controls, and low marginal cost. Defenses involve economic friction, rate controls, output minimization, anomaly detection, and contractual controls.

## Procedure
1. Define protected intellectual assets and realistic attacker goals.
2. Identify interfaces that reveal high-information outputs.
3. Simulate bounded high-volume or adaptive querying using test accounts.
4. Measure behavioral fidelity achievable from collected outputs.
5. Test rate limits, account rotation assumptions, and anomaly signals.
6. Inspect errors and metadata for architecture leakage.
7. Evaluate mitigations against legitimate high-volume customers.
8. Document residual economic and technical risk.

## Decision points
Use stricter controls for high-value capabilities, but avoid controls that make legitimate batch workloads unusable. Prefer layered detection over a single static quota.

## Common failure patterns
Equating prompt secrecy with IP protection; no cross-account detection; exposing unnecessary probabilities; limits that reset predictably; no telemetry for adaptive extraction.

## Verification
Demonstrate that extraction cost, fidelity, or scale is materially constrained and suspicious patterns generate actionable signals without unacceptable false positives.

## Expected output
A bounded extraction-risk assessment with evidence, economics, detection gaps, and mitigation priorities.

## Stop conditions
Do not conduct unbounded traffic, evade real provider controls, or target third-party models without explicit authorization.