# Model Extraction Rules

## Purpose
Reduce the risk that adversaries reconstruct proprietary or security-sensitive model behavior through repeated queries.

## Scope
Applies to externally reachable inference APIs, SDKs, batch endpoints, and partner integrations.

## MUST
- Assess extraction risk for models whose parameters, decision boundaries, or learned behavior are sensitive assets.
- Apply rate, quota, identity, and abuse controls proportionate to exposure and asset value.
- Monitor for anomalous high-volume, systematically exploratory, or distributed querying patterns.
- Define response and containment procedures for suspected extraction campaigns.

## MUST NOT
- Expose unrestricted high-fidelity prediction detail when it is unnecessary for the product contract.
- Rely on obscurity of the model architecture as the primary extraction defense.
- Block legitimate clients based on weak anomaly signals without reviewable evidence.

## SHOULD
- Minimize unnecessary confidence precision and auxiliary outputs.
- Test defenses against realistic adaptive extraction strategies.

## Exceptions
Open-model services may accept extraction by design, but that posture must be explicit and must not weaken controls protecting data, credentials, or infrastructure.

## Verification
Review API contracts, quotas, telemetry, abuse detections, extraction simulations, and incident runbooks.