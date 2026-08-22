# Payment and Purchase Rules
## Purpose
Prevent duplicate charges, entitlement errors, fraud exposure, and irrecoverable purchase states.
## Scope
In-app purchases, subscriptions, external payments where permitted, receipts, restoration, and entitlements.
## MUST
- Purchase completion MUST be verified using the platform/provider's authoritative mechanism before durable entitlement is granted when required.
- Purchase processing MUST be idempotent across retries, app restarts, and duplicate callbacks.
- Restore/reconciliation behavior MUST exist for supported durable purchases and subscriptions.
- Financially destructive or refund-like production actions by agents MUST require explicit authority.
## MUST NOT
- Client-only flags MUST NOT be the authoritative source of paid entitlement.
- A timeout MUST NOT be presented as a failed charge until provider state is reconciled.
## SHOULD
- Purchase UI SHOULD distinguish pending, completed, cancelled, and unknown states.
## Exceptions
Zero-value test transactions may use sandbox shortcuts only in isolated non-production environments.
## Verification
Test duplicate callbacks, pending purchases, interrupted confirmation, restore, refund/revocation, account switching, and provider outage.