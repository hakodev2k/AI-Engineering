# Webhook Integrity Rules

## Purpose
Treat provider webhooks as authenticated, replayable, and potentially duplicated external events.

## Scope
Payment, refund, dispute, payout, settlement, and account-status webhooks.

## MUST
- Webhook authenticity MUST be verified using the provider-supported signature or equivalent mechanism before business processing.
- Verification MUST use the raw payload when the provider signature scheme requires it.
- Event processing MUST be idempotent and safe under duplicate delivery.
- Event identity, receipt time, verification result, and processing outcome MUST be auditable.
- Out-of-order webhook delivery MUST not corrupt payment state.

## MUST NOT
- MUST NOT trust source IP alone as proof of webhook authenticity.
- MUST NOT acknowledge successful processing before required durable state is committed.
- MUST NOT log sensitive webhook payload fields without an approved data-handling basis.

## SHOULD
- Separate receipt from asynchronous processing so transient downstream failures can be retried safely.

## Exceptions
Require documented provider limitation, compensating verification, risk, and approval.

## Verification
Use signature tests, replay tests, duplicate-event tests, reordered-event tests, and audit-log inspection.