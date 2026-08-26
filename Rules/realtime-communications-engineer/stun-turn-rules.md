# STUN and TURN Rules

## Purpose
Provide secure, dependable NAT traversal and relay service.

## Scope
STUN discovery, TURN allocation, credentials, relay capacity, and regional deployment.

## MUST
- TURN access MUST require time-bounded authenticated credentials.
- Relay capacity MUST be sized and monitored for bandwidth, allocations, and regional failure.
- TLS/DTLS transport options MUST be available where network policy requires them.
- Credential rotation and abuse controls MUST be operationally defined.

## MUST NOT
- MUST NOT expose an unauthenticated public relay.
- MUST NOT embed long-lived TURN secrets in clients.
- MUST NOT claim direct-connectivity reliability without measuring relay fallback rates.

## SHOULD
- TURN endpoints SHOULD be geographically close to expected users and redundantly deployed.

## Exceptions
Any relaxation requires security approval, bounded duration, compensating controls, and telemetry.

## Verification
Inspect configuration, credential TTLs, allocation metrics, relay tests, abuse alerts, and regional failover drills.