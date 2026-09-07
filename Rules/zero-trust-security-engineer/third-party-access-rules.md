# Third-Party Access Rules

## Purpose
Constrain vendor, contractor, partner, and external support access to explicit, reviewable trust relationships.

## Scope
Applies to external human users, partner services, vendor support accounts, federated identities, and outsourced operations.

## MUST
- Third-party access MUST have a named internal owner and documented business purpose.
- Access MUST be scoped to required resources, actions, and duration.
- Federation or external identity claims MUST be validated to defined assurance requirements.
- Offboarding and contract termination MUST revoke access promptly.

## MUST NOT
- MUST NOT grant permanent broad access solely because a vendor is trusted commercially.
- MUST NOT permit unmanaged shared vendor accounts for sensitive systems.
- MUST NOT allow third parties to create unreviewed persistent access paths.

## SHOULD
- Sensitive third-party access SHOULD use just-in-time elevation and session monitoring.
- External identities SHOULD be distinguishable from workforce identities in policy and audit records.

## Exceptions
Extended or broad access requires risk assessment, compensating controls, data-owner or system-owner approval, monitoring, and expiry.

## Verification
Review external-account inventory, federation configuration, entitlement scope, access logs, contract/offboarding evidence, and tests proving expired or removed partners cannot retain access.