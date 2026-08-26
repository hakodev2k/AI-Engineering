# Graph and Network Rules

## Purpose
Use relationship graphs for fraud detection without turning weak associations into unsupported conclusions.

## Scope
Entity graphs, connected-component analysis, network features, rings, and coordinated-behavior detection.

## MUST
- Every graph edge MUST have defined semantics, provenance, confidence, and time validity.
- Network-based actions MUST account for common benign hubs such as shared networks, addresses, or devices.
- Graph features MUST prevent future-information leakage in historical evaluation.
- High-impact ring findings MUST preserve evidence explaining material connections.

## MUST NOT
- MUST NOT label an entity fraudulent solely because it is connected to a known bad entity without validated policy.
- MUST NOT let stale relationships persist indefinitely without defined expiry semantics.

## SHOULD
- Graph analysis SHOULD distinguish direct evidence from multi-hop inference.

## Exceptions
Require documented evidence threshold, risk assessment, and approval for high-impact use.

## Verification
Inspect edge definitions, temporal replay, benign-hub tests, sampled network cases, feature lineage, and investigator evidence.