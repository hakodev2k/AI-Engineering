# Performance and Scale Rules

## Purpose
Ensure identity controls meet latency and throughput needs without sacrificing correctness or security.

## Scope
Authentication, token validation, directory lookup, policy evaluation, provisioning, group expansion, and identity APIs.

## MUST
- Performance requirements MUST be defined for critical identity paths and measured under representative load.
- Optimization claims MUST include before/after evidence and preserve security semantics.
- Caches of authorization-relevant data MUST have explicit freshness, invalidation, and revocation behavior.
- Rate limits and backpressure MUST protect shared identity dependencies from abusive or runaway clients.

## MUST NOT
- MUST NOT bypass authorization checks to reduce latency.
- MUST NOT cache sensitive decisions indefinitely or beyond acceptable revocation windows.
- MUST NOT infer scalability from low-volume functional tests.

## SHOULD
- Prefer local cryptographic validation of suitable tokens over synchronous central calls when trust and revocation requirements permit.

## Exceptions
Relaxed freshness or consistency requires documented trade-off, maximum exposure window, evidence, monitoring, and approval.

## Verification
Use load tests, latency percentiles, dependency metrics, cache-invalidation tests, revocation tests, and capacity evidence.