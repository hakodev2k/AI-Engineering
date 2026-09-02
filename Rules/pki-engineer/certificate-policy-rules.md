# Certificate Policy

## Purpose
Ensure certificates are issued only under explicit, reviewable assurance requirements.

## Scope
Applies to certificate policies, certification practice statements, profiles, eligibility, validation, issuance, and lifecycle controls.

## MUST
- Every certificate class MUST map to a documented policy defining subject eligibility, validation evidence, key protection, validity, renewal, revocation, and audit requirements.
- Policy identifiers and profile constraints MUST remain consistent with actual issuance practices.
- Material policy changes MUST include impact analysis for relying parties and existing certificates.
- Policy exceptions MUST be traceable to approved risk acceptance.

## MUST NOT
- MUST NOT advertise an assurance level unsupported by implemented controls.
- MUST NOT issue from a generic profile when a stricter certificate class is required.
- MUST NOT change validation requirements silently.

## SHOULD
- Policies SHOULD distinguish human, machine, device, code-signing, and infrastructure identities where assurance differs.
- Obsolete policies SHOULD be formally deprecated.

## Exceptions
Require reason, scope, expiry, compensating controls, evidence, and accountable approval.

## Verification
Review certificate policies, practice statements, issuance profiles, sample certificates, validation records, and audit findings.