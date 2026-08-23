# Growth Security Rules

## Purpose
Prevent growth features from weakening application, account, or data security.

## Scope
Referral systems, promotions, signup, invitations, deep links, tracking endpoints, and growth integrations.

## MUST
- Apply authentication, authorization, validation, rate limits, and abuse controls according to the risk of each growth surface.
- Treat referral codes, promo codes, invite tokens, and attribution parameters as untrusted input.
- Threat-model material incentives and externally reachable growth endpoints.

## MUST NOT
- Put credentials or privileged secrets in client code, URLs, analytics events, or campaign content.
- Disable security controls to improve conversion without explicit security approval.

## SHOULD
- Prefer short-lived, scoped, non-sensitive tokens and server-side validation for valuable actions.

## Exceptions
Security exceptions require documented risk, compensating controls, owner, expiry, and authorized approval.

## Verification
Use code review, security tests, abuse tests, configuration inspection, dependency scanning, and production security telemetry.