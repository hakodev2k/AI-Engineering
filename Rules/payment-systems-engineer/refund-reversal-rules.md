# Refund and Reversal Rules

## Purpose
Ensure refunds and reversals produce correct, bounded, and traceable financial outcomes.

## Scope
Full and partial refunds, authorization reversals, voids, cancellation flows, and corrective payment actions.

## MUST
- Refund eligibility MUST be validated against captured amount, prior refunds, currency, ownership, and payment state.
- Partial refunds MUST prevent cumulative refunded value from exceeding the refundable amount unless an explicitly approved adjustment process exists.
- Refund and reversal requests MUST be idempotent.
- The system MUST preserve the distinction between requested, accepted, pending, failed, and completed refund states.
- Provider failures or uncertain outcomes MUST be reconciled before a duplicate corrective action is issued.

## MUST NOT
- MUST NOT mark a refund complete solely because a provider request was accepted.
- MUST NOT silently convert refund failures into success.
- MUST NOT mutate the original payment amount to represent a refund.

## SHOULD
- Customer-visible status SHOULD reflect actual financial state rather than optimistic assumptions.

## Exceptions
Exceptions require financial-owner approval and documented recovery steps.

## Verification
Test full, partial, duplicate, concurrent, failed, delayed, and over-refund cases and compare against provider records.