# Bounce Classification and Remediation

## Purpose
Convert raw delivery failures into reliable recipient, infrastructure, policy, and reputation actions while preventing harmful retries.

## When to use
Use when building event pipelines, investigating bounce spikes, tuning suppression, or comparing provider taxonomies.

## Inputs
SMTP codes, enhanced status codes, DSNs/provider events, recipient domains, timestamps, retry history, and message metadata.

## Preconditions
Preserve original provider response text and identifiers before normalizing events.

## Context to inspect
Inspect SMTP stage, 4xx/5xx semantics, mailbox state, policy blocks, reputation signals, DNS/TLS errors, and provider-specific documentation.

## Core knowledge
“Hard” and “soft” are operational abstractions. The same broad category can require different actions. Permanent invalid-recipient failures should suppress promptly; transient capacity or policy deferrals need bounded retries and monitoring.

## Procedure
1. Store exact raw response and normalized fields.
2. Classify recipient, content/policy, reputation, authentication, infrastructure, quota, and transient failures.
3. Distinguish immediate 5xx from later asynchronous DSNs.
4. Define suppression rules for permanent recipient failures.
5. Define bounded retries for genuinely transient failures.
6. Aggregate trends by provider, domain, campaign, IP, and source cohort.
7. Investigate sudden taxonomy shifts before changing rules.
8. Feed systemic causes to reputation, DNS, rate-control, or application owners.
9. Test classification with historical labeled examples.

## Decision points
Suppress only when evidence indicates durable recipient invalidity or policy requires it. Retry provider throttles conservatively; do not retry known invalid addresses.

## Common failure patterns
Mapping all 5xx to bad address, discarding raw text, infinite soft-bounce retries, provider-specific codes interpreted generically, and suppressing users after temporary mailbox-full events.

## Verification
Replay representative events through classification, verify suppression/retry outcomes, reconcile totals to provider records, and confirm spikes lead to actionable segmented alerts.

## Expected output
A documented bounce taxonomy, action matrix, and validated event-processing rules.

## Stop conditions
Stop automatic remediation when response semantics are ambiguous enough to risk suppressing legitimate users or repeatedly mailing invalid recipients.