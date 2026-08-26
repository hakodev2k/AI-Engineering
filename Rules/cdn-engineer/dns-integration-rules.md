# DNS Integration Rules

## Purpose
Ensure DNS and CDN configuration compose safely during normal routing, migration, and failure.

## Scope
Applies to CDN hostnames, aliases, TTLs, validation records, DNSSEC interactions, migrations, and cutovers.

## MUST
- DNS records directing traffic to CDN endpoints MUST reference valid, provisioned hostnames.
- Cutovers MUST account for DNS TTL, resolver caching, CDN propagation, and certificate readiness.
- Migration plans MUST define coexistence and rollback behavior while old DNS answers remain cached.
- Domain validation records MUST be owned and lifecycle-managed.

## MUST NOT
- MUST NOT remove old delivery infrastructure before relevant DNS caches can reasonably expire and rollback risk is accepted.
- MUST NOT lower DNS TTLs as a substitute for testing failover behavior.
- MUST NOT publish a CDN hostname before TLS and routing are ready for traffic.

## SHOULD
- Lower TTLs ahead of planned high-risk migrations when operationally justified.
- Monitor DNS resolution from representative networks.
- Keep DNS and CDN ownership boundaries documented.

## Exceptions
Emergency DNS changes require incident authority, impact assessment, and post-change verification.

## Verification
Resolve records from multiple networks; inspect authoritative configuration, TTLs, DNSSEC status, certificates, CDN hostname readiness, and cutover/rollback tests.