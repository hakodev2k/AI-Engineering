# Third-Party Secrets Rules

## Purpose
Control credentials exchanged with vendors, SaaS platforms, partners, and external APIs.

## Scope
Externally issued API credentials, integration tokens, shared certificates, partner keys, and vendor administrative access.

## MUST
- Third-party credentials MUST have owner, vendor, purpose, privilege scope, environment, expiry/rotation capability, and offboarding procedure.
- External credentials MUST be restricted to the minimum supported permissions and network/resource scope.
- Vendor compromise or contract termination MUST trigger review and replacement or revocation of affected credentials.
- Sharing methods MUST use approved protected channels.

## MUST NOT
- One external credential MUST NOT be reused across unrelated applications or environments when separate credentials are supported.
- Vendor documentation or support tickets MUST NOT contain secret values unless an approved secure exchange mechanism explicitly requires it.
- Lack of vendor rotation support MUST NOT remain an undocumented risk.

## SHOULD
- Prefer federated authorization, scoped tokens, and vendor features supporting short lifetimes.
- Track third-party secret-management limitations in supplier risk reviews.

## Exceptions
Vendor constraints require documented risk, compensating controls, owner, and periodic reassessment.

## Verification
Review vendor configuration, inventory metadata, permission scopes, rotation history, supplier assessments, termination procedures, and audit events.