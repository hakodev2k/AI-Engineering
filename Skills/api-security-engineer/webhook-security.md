# Webhook Security

## Purpose
Design inbound and outbound webhooks so events are authenticated, tamper-resistant, replay-aware, idempotent, and operationally safe.

## When to use
Use when implementing payment callbacks, SCM events, partner notifications, SaaS integrations, asynchronous status updates, or customer-configurable outbound webhooks.

## Inputs
Webhook contract, sender/receiver identity model, signing mechanism, delivery semantics, retry policy, event identifiers, secrets lifecycle, network constraints.

## Preconditions
Know which party controls delivery, whether payload ordering matters, acceptable replay window, and consequences of duplicate processing.

## Context to inspect
Signature generation/validation, canonical payload bytes, timestamps, event IDs, secret storage, rotation, retries, redirects, destination validation, queues, and dead-letter handling.

## Core knowledge
Webhook authenticity should rely on cryptographic signatures or mutually authenticated channels, not source IP alone. Verification must occur over the exact signed representation. Delivery is generally at-least-once, so consumers must tolerate duplicates.

## Procedure
1. Define sender and receiver trust assumptions.
2. Choose HMAC, asymmetric signatures, mTLS, or another suitable proof.
3. Specify canonical signed components, timestamp, and algorithm version.
4. Enforce a bounded timestamp/replay window.
5. Track event IDs or idempotency keys for duplicate suppression.
6. Rotate signing secrets without abrupt breakage.
7. Queue verified events before expensive processing.
8. Bound retry behavior and use dead-letter handling.
9. For outbound webhooks, validate customer destinations against SSRF policy.
10. Log verification outcomes without exposing secrets.
11. Test tampering, stale signatures, duplicates, ordering changes, and secret rotation.

## Decision points
Use asymmetric signatures when receivers should verify without holding a shared signing secret. Use HMAC for simpler bilateral integrations with strong secret management. Require stronger destination controls for customer-supplied callback URLs.

## Common failure patterns
IP-only trust, signing parsed JSON rather than exact bytes, no replay protection, non-idempotent consumers, secrets in URLs, unlimited retries, and accepting multiple algorithms without strict negotiation.

## Verification
Replay captured events, mutate payload bytes, rotate secrets, inject duplicates, and verify idempotent outcomes and stable audit evidence.

## Expected output
A secure webhook protocol with authentication, replay protection, lifecycle controls, idempotency, tests, and operational recovery behavior.

## Stop conditions
Escalate when the peer cannot provide verifiable authenticity, duplicate side effects cannot be made safe, or destination risk exceeds available egress controls.