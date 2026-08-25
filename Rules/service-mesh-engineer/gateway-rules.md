# Gateway Engineering
## Purpose
Control ingress, egress, and cross-boundary traffic safely.
## Scope
Ingress gateways, egress gateways, east-west gateways, listeners, routes, and TLS.
## MUST
- Gateway exposure MUST be explicitly inventoried and authorized.
- TLS termination and passthrough choices MUST preserve required authentication and policy controls.
- Gateway capacity MUST be validated for peak and failure scenarios.
## MUST NOT
- MUST NOT expose administrative or internal-only routes publicly.
- MUST NOT permit unrestricted egress where policy requires controlled destinations.
- MUST NOT change listener or certificate behavior without rollback planning.
## SHOULD
- Gateway configuration SHOULD minimize shared blast radius across unrelated trust boundaries.
## Exceptions
Exposure exceptions require security review, owner, expiry, and compensating controls.
## Verification
Inspect effective listeners/routes, external reachability, TLS tests, capacity telemetry, and negative access tests.