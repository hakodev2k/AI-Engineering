# Load Balancing Rules

## Purpose
Distribute traffic predictably while preserving health, security, and failure isolation.

## Scope
Layer 4/7 load balancers, reverse proxies, health checks, persistence, TLS termination, and failover.

## MUST
- Define health checks that represent service readiness rather than mere port availability when feasible.
- Validate timeout, retry, connection, persistence, and draining behavior against application semantics.
- Protect private keys and approved TLS policy at termination points.
- Test backend failure and recovery before relying on automated failover.

## MUST NOT
- Configure retries that can duplicate unsafe operations without application agreement.
- Keep failed backends in rotation to conceal monitoring problems.

## SHOULD
- Prefer stateless distribution and graceful connection draining where supported.

## Exceptions
Legacy persistence or health behavior requires documented dependency, risk, and migration intent.

## Verification
Inspect configuration, health state, TLS checks, traffic distribution, failure tests, and application telemetry.