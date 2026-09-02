# Trust Store Management

## Purpose
Control which trust anchors and intermediates relying systems accept.

## Scope
Applies to OS, application, browser, container, device, and custom trust stores.

## MUST
- Trust stores MUST have an authoritative source, ownership, approved update path, and inventory of accepted anchors.
- New trust anchors MUST undergo security, policy, and scope review before distribution.
- Removal plans MUST account for dependent certificate chains and propagation timing.
- Trust-store changes MUST be versioned and auditable.

## MUST NOT
- MUST NOT add broad public or private trust solely to solve one failing integration.
- MUST NOT distribute unverified root certificates through ad hoc scripts or manual copying.
- MUST NOT retain deprecated or compromised trust anchors after approved removal conditions are met.

## SHOULD
- Keep trust stores minimal for constrained workloads.
- Continuously compare deployed trust stores against approved state.

## Exceptions
Require affected systems, justification, risk analysis, rollback, expiry, and security approval.

## Verification
Inspect configured stores, configuration management, package or image contents, trust diffs, chain tests, and deployment records.