# Authorization, Capture, and Refund Flows

## Purpose
Implement multi-stage card/payment lifecycles correctly, including partial operations and asynchronous outcomes.

## When to use
Use when supporting authorize-only, delayed capture, partial capture, void, refund, or reversal behavior.

## Inputs
Business fulfillment rules, provider capabilities, authorization expiry, amounts, currencies, network constraints.

## Context to inspect
Payment states, provider attempts, order/fulfillment coupling, idempotency, webhook and reconciliation logic.

## Core knowledge
Authorization reserves funds but is not settlement. Capture initiates collection. Void/reversal releases an authorization; refund returns value after capture. Provider and rail rules determine partial and multiple-capture support.

## Procedure
1. Identify the business point for authorization and capture.
2. Confirm provider/rail capabilities and expiry windows.
3. Model authorized, captured, remaining, refunded, and refundable amounts explicitly.
4. Enforce amount/currency invariants.
5. Require idempotency on each mutation.
6. Serialize or otherwise protect concurrent captures/refunds.
7. Handle partial operations with cumulative limits.
8. Treat timeouts as unknown until queried/reconciled.
9. Map provider reversals and asynchronous events into legal transitions.
10. Prevent fulfillment from relying on ambiguous payment state.
11. Add expiry/uncaptured-authorization handling.
12. Test race conditions and recovery.

## Decision points
Choose immediate capture for low fulfillment risk; delayed capture when business rules require confirmation before collection and the rail supports it.

## Common failure patterns
Capture beyond authorization, refund beyond captured amount, conflating void/refund, duplicate captures, and assuming synchronous provider response is final.

## Verification
Test full/partial capture, duplicate commands, concurrent refunds, expiry, timeout recovery, and reconciliation with provider records.

## Expected output
A state-safe implementation with amount invariants, concurrency controls, idempotency, and recovery.

## Stop conditions
Escalate when business fulfillment timing conflicts with provider/network authorization constraints.