# Indicator Lifecycle
## Purpose
Keep indicators actionable without creating stale or harmful detections.
## Scope
IOCs, observables, enrichment, distribution, expiry, and revocation.
## MUST
- Preserve provenance, first/last seen, confidence, context, and handling restrictions.
- Define expiration or revalidation criteria for operational indicators.
- Revoke or downgrade indicators when evidence changes.
## MUST NOT
- Block infrastructure solely because an uncontextualized indicator appears in a feed.
- Treat hashes, domains, or IPs as permanently malicious.
## SHOULD
- Prefer behavior and relationships over isolated atomic indicators.
## Exceptions
Emergency blocking may precede full enrichment with explicit approval and rollback criteria.
## Verification
Sample indicator records, expiry jobs, false-positive reviews, and revocation history.