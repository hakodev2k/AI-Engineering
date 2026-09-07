# Mailbox Provider Diagnostics

## Purpose
Diagnose deliverability differences across major mailbox providers by combining protocol responses, provider reputation signals, cohort quality, authentication, and placement evidence.

## When to use
Use when one provider shows disproportionate deferrals, spam-folder placement, blocks, or engagement decline while others remain healthy.

## Inputs
Provider-segmented delivery metrics, SMTP responses, reputation dashboards, authentication results, complaint/bounce data, volume history, recipient cohorts, and placement tests.

## Preconditions
Segment by actual recipient MX/provider, not only recipient-domain strings when hosted domains may map to shared infrastructure.

## Context to inspect
Inspect sending IP/domain reputation, complaint rates, cadence changes, authentication, provider-specific status codes, rate limits, user engagement, and recent infrastructure/content changes.

## Core knowledge
Mailbox providers use different proprietary filtering and reputation systems. A global average can hide a severe provider-local problem. Remediation should target controllable causes rather than folklore about filters.

## Procedure
1. Establish provider-specific baseline and time of divergence.
2. Correlate with volume, cohorts, identities, content, and infrastructure changes.
3. Read exact SMTP/enhanced status responses.
4. Inspect available provider reputation/postmaster signals.
5. Compare authentication and complaint/bounce rates.
6. Test representative messages and cohorts without creating probing volume.
7. Isolate whether the cause is reputation, rate, authentication, content/link, recipient quality, or provider incident.
8. Apply one measurable remediation at a time.
9. Observe enough traffic to distinguish noise from recovery.

## Decision points
Reduce volume when provider throttling/reputation signals support it. Avoid changing domains/IPs merely because one provider filters mail. Escalate to provider support when evidence is clean but persistent policy blocks remain opaque.

## Common failure patterns
Using global metrics, relying on seed tests alone, guessing at content keywords, ignoring provider-specific response text, and overreacting to short-term noise.

## Verification
Confirm provider-specific acceptance, deferral, complaint, reputation, and placement trends recover across representative real recipients.

## Expected output
A provider-scoped root-cause assessment, remediation, and monitored recovery evidence.

## Stop conditions
Stop risky tests or traffic increases when provider enforcement is active or recipient quality cannot be demonstrated.