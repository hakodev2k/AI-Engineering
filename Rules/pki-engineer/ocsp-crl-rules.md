# OCSP and CRL

## Purpose
Provide reliable certificate status information to relying parties.

## Scope
Applies to OCSP responders, CRL generation, distribution points, freshness, signing, and availability.

## MUST
- Revocation status services MUST meet documented freshness and availability requirements.
- CRLs and OCSP responses MUST be signed by authorized keys with protected custody.
- Publication paths MUST be reachable by intended relying parties and monitored.
- Status update timing MUST align with incident and certificate-policy requirements.

## MUST NOT
- MUST NOT publish stale status data beyond policy-defined limits.
- MUST NOT reuse status-signing keys outside their intended role.
- MUST NOT assume clients will fail closed when status endpoints are unavailable.

## SHOULD
- Design status services to avoid a single operational dependency that can invalidate otherwise healthy authentication paths.
- Test representative client behavior during responder failure.

## Exceptions
Require documented relying-party behavior, compensating control, bounded duration, and approval.

## Verification
Check CRL next-update values, OCSP response validity, endpoint health, signature chains, monitoring, and failover tests.