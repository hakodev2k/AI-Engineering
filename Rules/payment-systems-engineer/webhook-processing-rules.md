# Webhook Processing Rules

## Purpose
Process asynchronous provider notifications reliably and safely.

## Scope
Payment, refund, dispute, settlement, payout, and account-status webhooks.

## MUST
- Webhook authenticity MUST be verified before business processing using the provider-supported signature or equivalent control.
- Raw delivery identifiers, event identifiers, receive time, and processing outcome MUST be recorded for replay and audit.
- Processing MUST be idempotent and tolerant of duplicates, delays, and out-of-order delivery.
- Business processing SHOULD be decoupled from the HTTP acknowledgement path when long work is required.
- Unknown event types and schema changes MUST fail safely and be observable.

## MUST NOT
- MUST NOT trust source IP alone as proof of webhook authenticity.
- MUST NOT assume delivery order equals business order.
- MUST NOT perform repeated financial effects for redelivered events.

## SHOULD
- Webhook handlers SHOULD acknowledge only after durable acceptance of the event.

## Exceptions
Exceptions require provider limitation evidence and compensating authenticity and replay controls.

## Verification
Test invalid signatures, duplicate delivery, delayed events, reordered events, schema changes, queue failure, and replay behavior.