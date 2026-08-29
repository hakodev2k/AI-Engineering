# Model Extraction Defense Rules

## Purpose
Reduce unauthorized replication, systematic inference, or theft of proprietary model behavior, weights, and high-value capabilities.

## Scope
Applies to hosted model endpoints, downloadable artifacts, embeddings, confidence signals, administrative interfaces, and model registries.

## MUST
- Models and capabilities requiring extraction protection MUST be identified according to business, security, and intellectual-property impact.
- Exposed inference services MUST enforce authenticated usage controls, quotas, and rate limits proportionate to extraction risk.
- High-volume or highly systematic probing patterns MUST be monitored and investigated when they materially exceed normal usage behavior.
- Access to weights, checkpoints, adapters, and export functions MUST follow least privilege and be auditable.
- High-value model exposure MUST have documented containment and response actions for suspected extraction attempts.

## MUST NOT
- MUST NOT expose raw model weights, checkpoints, or export capabilities to unauthorized principals.
- MUST NOT rely solely on obscurity, output randomness, or prompt instructions as extraction defenses.
- MUST NOT remove quotas or raise high-risk limits for unknown or untrusted clients without documented risk review.
- MUST NOT treat watermarking or fingerprinting as a substitute for access control.

## SHOULD
- Detection SHOULD consider request volume, query diversity, adaptive probing behavior, identity history, and cost patterns.
- Watermarking or behavioral fingerprinting SHOULD be used only as supporting evidence where technically appropriate.

## Exceptions
Exceptions require documented business need, exposed capability, extraction risk, compensating controls, monitoring, duration, and accountable approval.

## Verification
Inspect endpoint IAM, quotas, rate limits, artifact permissions, audit logs, anomaly detections, extraction-simulation results, and incident-response procedures.