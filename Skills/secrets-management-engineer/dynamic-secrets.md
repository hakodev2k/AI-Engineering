# Dynamic Secrets

## Purpose
Replace long-lived shared credentials with short-lived, identity-bound credentials issued on demand and revoked automatically.

## When to use
Use for databases, cloud APIs, infrastructure access, and services that support programmatic credential issuance or temporary tokens.

## Inputs
- Target system authentication capabilities
- Workload identities
- Required permissions
- Lease and availability requirements

## Context to inspect
Inspect current static credentials, connection pooling, client retry behavior, target-system limits, identity providers, and secret-store plugins or brokers.

## Core knowledge
Dynamic secrets reduce standing privilege but introduce lease lifecycle, renewal, revocation, broker availability, and application integration concerns. TTL must exceed normal operation windows without creating unnecessary exposure.

## Procedure
1. Identify static credentials suitable for dynamic replacement.
2. Define the minimum target-system role or policy.
3. Configure trusted workload authentication to the broker.
4. Configure credential issuance with bounded TTL and maximum lifetime.
5. Integrate retrieval without logging credential material.
6. Handle lease renewal or reacquisition before expiry.
7. Design connection-pool behavior when credentials rotate.
8. Implement revocation on workload termination or incident response.
9. Add issuance, renewal, failure, and revocation telemetry.
10. Test dependency and broker outages.

## Decision points
Use renewable leases for long-lived workloads when safe; use non-renewable short credentials for bounded jobs. Prefer per-workload credentials over shared leases when attribution matters.

## Common failure patterns
- TTL shorter than normal transactions
- Applications caching expired credentials indefinitely
- Excessive issuance causing target-system overload
- Broad generated roles
- Failure to revoke credentials after compromise

## Verification
Prove a workload receives only scoped permissions, credentials expire or revoke as designed, renewal works, logs contain no values, and stale credentials fail after revocation.

## Expected output
A tested dynamic-credential flow with scoped policy, lease lifecycle, telemetry, and failure behavior.

## Stop conditions
Stop if the target cannot support safe automated lifecycle management, required permissions are unclear, or issuance would create an uncontrolled availability dependency.