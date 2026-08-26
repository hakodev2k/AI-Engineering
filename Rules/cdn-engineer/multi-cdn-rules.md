# Multi-CDN Rules

## Purpose
Use multiple delivery providers without introducing inconsistent behavior or unsafe failover.

## Scope
Applies to provider parity, traffic steering, failover, configuration portability, observability, and operational ownership.

## MUST
- Multi-CDN designs MUST define which behaviors require semantic parity across providers.
- Failover targets MUST be tested with production-equivalent cache, TLS, security, routing, and origin policies.
- Traffic steering MUST have deterministic health criteria and rollback behavior.
- Provider-specific differences affecting correctness or security MUST be documented.
- Capacity and contractual limits MUST support intended failover load.

## MUST NOT
- MUST NOT assume configuration names with similar labels behave identically across providers.
- MUST NOT fail traffic to an untested provider during routine operations.
- MUST NOT maintain dormant failover infrastructure without periodic validation.

## SHOULD
- Automate conformance tests across providers.
- Keep application contracts provider-neutral where practical.
- Exercise partial and full traffic shifts regularly.

## Exceptions
Intentional provider divergence requires documented requirement, user impact, operational handling, and architecture/security review when relevant.

## Verification
Run cross-provider conformance tests; compare headers, cache behavior, TLS, WAF, routing, logs, latency, and origin load; execute controlled failover and recovery exercises.