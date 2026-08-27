# Email DNS Engineering

## Purpose
Manage DNS records that determine mail routing, sender authentication, and deliverability without weakening anti-spoofing controls.

## When to use
Mail-provider migration, domain onboarding, SPF/DKIM/DMARC changes, MX incidents, or deliverability remediation.

## Inputs
Mail providers, sending sources, MX targets, SPF requirements, DKIM selectors, DMARC policy, reports, existing TXT records.

## Context to inspect
MX priorities, A/AAAA of mail hosts, SPF lookup count, DKIM keys, DMARC alignment, CNAME delegation, reverse DNS ownership, TTLs.

## Core knowledge
SPF authenticates envelope sending sources, DKIM signs messages, and DMARC evaluates alignment/policy. DNS correctness alone does not guarantee deliverability.

## Procedure
1. Inventory all legitimate senders and inbound providers.
2. Validate MX targets and address resolution.
3. Consolidate SPF without exceeding protocol lookup limits.
4. Publish DKIM selectors from approved providers and verify key length/format.
5. Start DMARC with reporting/monitoring appropriate to current maturity.
6. Analyze alignment and legitimate failures.
7. Tighten DMARC policy only after sender inventory is trustworthy.
8. Coordinate reverse DNS with IP owner.
9. Stage provider migrations with overlapping records where safe.
10. Validate using real test messages plus DNS queries.

## Decision points
Move toward DMARC quarantine/reject when legitimate streams consistently align. Delegate provider-specific subdomains/selectors to reduce shared-record coupling.

## Common failure patterns
Multiple SPF records, SPF lookup overflow, stale DKIM selectors, strict DMARC before sender discovery, wrong MX priority assumptions, and missing PTR control.

## Verification
Check DNS syntax, SPF evaluation, DKIM signature verification, DMARC alignment, MX delivery path, and aggregate reports.

## Expected output
Validated mail DNS records, sender inventory, staged DMARC policy, and migration/rollback evidence.

## Stop conditions
Stop when legitimate senders are unknown, security policy ownership is missing, or provider requirements conflict with domain authentication controls.