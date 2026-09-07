# Suppression and List Hygiene

## Purpose
Maintain a single trustworthy decision layer that prevents mail to invalid, complained, unsubscribed, or otherwise ineligible recipients while preserving legitimate transactional exceptions.

## When to use
Use when designing recipient eligibility, reconciling multiple ESPs, investigating repeated bounces/complaints, or migrating providers.

## Inputs
Unsubscribes, complaints, hard-bounce events, consent/preferences, legal holds, product notification requirements, and provider suppressions.

## Preconditions
Define message classes and which suppression reasons apply to each class.

## Context to inspect
Inspect suppression sources, timestamps, scope, reason codes, propagation latency, provider-local lists, re-subscription rules, and data retention.

## Core knowledge
Suppression is a safety control, not merely an ESP feature. Provider-local lists can diverge. Re-engagement does not justify repeatedly mailing long-inactive or invalid addresses. Re-subscription must be explicit and auditable.

## Procedure
1. Define canonical suppression reasons and precedence.
2. Establish an authoritative cross-provider store or service.
3. Normalize provider bounce/complaint/unsubscribe events into it.
4. Apply eligibility checks before provider submission.
5. Define carefully scoped exceptions for essential transactional messages.
6. Set propagation SLOs and idempotent event processing.
7. Reconcile provider-local suppressions against canonical state.
8. Define verified re-subscription and address-change flows.
9. Audit stale, duplicate, and conflicting records.
10. Monitor attempted sends blocked by suppression reason.

## Decision points
Keep permanent invalid-address suppression durable. Allow re-subscription only with fresh, trustworthy intent. Prefer global complaint suppression for non-essential mail unless business policy clearly requires narrower scope.

## Common failure patterns
Per-ESP silos, delayed unsubscribe propagation, silently clearing suppressions during migration, conflating account deletion with email preference, and bypassing suppression in batch jobs.

## Verification
Test each reason and exception path, verify propagation across all senders, replay duplicate events safely, and prove suppressed addresses cannot receive applicable mail.

## Expected output
A canonical suppression model with documented precedence, exceptions, reconciliation, and evidence.

## Stop conditions
Stop sending affected classes if suppression state is unavailable, inconsistent, or cannot be enforced before handoff.