# Webhook Security Rules

## Purpose
Secure outbound and inbound webhook flows against forgery, replay, leakage, and unsafe delivery.

## Scope
Webhook registration, delivery, verification, retries, payloads, and callbacks.

## MUST
- Authenticate webhook messages with a vetted signature or equivalent mechanism and validate freshness.
- Protect against replay using timestamps, nonces, identifiers, or equivalent controls appropriate to risk.
- Validate destination URLs and restrict unsafe network destinations where server-side requests are made.
- Define retry behavior that does not create duplicate unsafe effects.

## MUST NOT
- Trust source IP alone as message authenticity when stronger verification is available.
- Include unnecessary secrets or sensitive data in webhook payloads.

## SHOULD
- Support secret rotation and delivery observability without exposing secret material.

## Exceptions
Legacy consumers require documented compensating controls and migration plan.

## Verification
Run signature, replay, SSRF, duplicate-delivery, rotation, and failure-path tests; inspect delivery logs and configuration.