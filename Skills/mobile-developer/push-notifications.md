# Push Notifications

## Purpose
Implement reliable, privacy-aware push delivery and routing across device and app states.

## When to use
Transactional alerts, reminders, messaging, background notification flows.

## Inputs
Notification requirements, provider contract, payload schema, routing rules.

## Context to inspect
Permission UX, token registration, backend mapping, handlers, deep links, analytics.

## Core knowledge
Push is best-effort, may be delayed/duplicated, and is not a durable queue. Sensitive content can appear on lock screens.

## Procedure
1. Define notification classes and urgency.
2. Request permission contextually.
3. Register/rotate device tokens safely.
4. Version payload schema.
5. Keep payload minimal and non-sensitive.
6. Make handlers idempotent.
7. Route taps through validated navigation.
8. Handle foreground/background/terminated states.
9. Measure delivery-to-action without logging sensitive data.

## Decision points
Use silent/background pushes only when platform policy and product need justify them; fetch authoritative data after receipt when appropriate.

## Common failure patterns
Treating push as guaranteed, stale tokens, secrets in payloads, duplicate side effects, notification spam.

## Verification
Real-device tests across lifecycle, token rotation, duplicate/delayed payloads, permission denial.

## Expected output
Safe notification lifecycle with observable delivery and routing.

## Stop conditions
Escalate requirements that conflict with platform background or privacy policies.