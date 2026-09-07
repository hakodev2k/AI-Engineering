# Sending Domain and Subdomain Strategy

## Purpose
Partition sending identities so reputation, policy, ownership, and troubleshooting boundaries match business risk without creating unnecessary domain sprawl.

## When to use
Use during new program launches, provider migrations, traffic-class separation, or reputation recovery.

## Inputs
Message classes, visible From requirements, volumes, brands, providers, authentication capabilities, and existing reputation history.

## Preconditions
Know which domains are customer-facing and which teams own DNS and sending applications.

## Context to inspect
Inspect From, Return-Path, DKIM `d=`, link domains, HELO names, DMARC policies, historical reputation, and cross-stream dependencies.

## Core knowledge
Subdomains can isolate reputation and policy while remaining organizationally aligned for DMARC. Excessive fragmentation creates low-volume cold identities and operational overhead. Consistency across visible and technical identities improves diagnosability.

## Procedure
1. Classify traffic by transactional importance, consent model, cadence, and risk.
2. Map current identity domains for headers, envelopes, DKIM, links, and tracking.
3. Identify harmful reputation coupling.
4. Propose the smallest useful set of subdomain boundaries.
5. Define ownership and DNS/authentication standards per boundary.
6. Decide whether tracking/link domains also need isolation.
7. Plan warming for any new identity.
8. Roll out one stream at a time with comparative monitoring.
9. Update suppression, reporting, and dashboards to preserve global controls.
10. Periodically retire unused identities.

## Decision points
Separate critical transactional from promotional mail when volume or reputation risk is material. Keep related low-volume streams together if separation would prevent reputation accumulation. Use distinct brands/domains only when user expectation and governance justify it.

## Common failure patterns
Creating a new subdomain for every campaign, moving bad lists to fresh domains, inconsistent DKIM alignment, shared tracking domains coupling otherwise isolated streams, and abandoned DNS records.

## Verification
Confirm all identity mappings, DMARC alignment, warming controls, traffic routing, suppression coverage, and provider-level reputation metrics after migration.

## Expected output
A minimal domain taxonomy with rationale, ownership, migration sequence, and monitoring boundaries.

## Stop conditions
Stop if business branding requirements conflict with authentication or if historic reputation/traffic ownership cannot be established.