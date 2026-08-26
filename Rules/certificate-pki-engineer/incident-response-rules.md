# PKI Incident Response Rules

## Purpose
Contain certificate and key incidents while preserving evidence and trust continuity.

## Scope
Key compromise, mis-issuance, unauthorized trust, CA failure, revocation failure, and expiry incidents.

## MUST
- Incidents MUST classify affected keys, certificates, issuers, relying parties, and trust scope using evidence.
- Containment decisions MUST distinguish analysis, preparation, and execution authority.
- Key compromise response MUST evaluate revocation, replacement, trust-store impact, and dependent outages.
- Evidence MUST preserve relevant logs, serials, fingerprints, timestamps, and configuration state.

## MUST NOT
- MUST NOT destroy or rotate critical evidence before capture unless immediate containment requires it.
- MUST NOT execute mass revocation or trust removal without authorized incident command except under pre-approved emergency authority.
- MUST NOT assume compromise scope from confidence alone.

## SHOULD
- High-impact scenarios SHOULD be exercised periodically.

## Exceptions
Emergency actions require retrospective evidence and review.

## Verification
Review runbooks, exercises, incident records, approval paths, and evidence quality.