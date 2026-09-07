# SPF Design and Validation

## Purpose
Design and validate SPF so recipient systems can authenticate the envelope-sender domain without fragile DNS, accidental authorization, or operational surprises.

## When to use
Use when onboarding senders, changing providers, adding IPs, diagnosing SPF failures, or consolidating DNS. SPF alone does not authenticate the visible From domain unless alignment is achieved through the authenticated MAIL FROM domain.

## Inputs
Sending domains, envelope-from domains, all legitimate outbound sources, current TXT records, provider include mechanisms, DNS ownership, and DMARC alignment requirements.

## Preconditions
Inventory actual senders before editing DNS. Confirm which domain is evaluated for SPF.

## Context to inspect
Inspect TXT records recursively, include/redirect chains, DNS lookup count, qualifiers, CIDRs, duplicate SPF records, forwarding behavior, and DMARC alignment.

## Core knowledge
SPF authorizes infrastructure for a domain; it is not a sender whitelist for arbitrary headers. Only one SPF policy record should exist per evaluated domain. Excessive DNS-triggering mechanisms can cause `permerror`. Forwarding commonly breaks SPF, making DKIM important for DMARC resilience.

## Procedure
1. Enumerate every legitimate source using the envelope-from domain.
2. Retrieve and expand the existing SPF policy.
3. Count DNS-triggering mechanisms and identify brittle nested includes.
4. Remove stale or unjustified authorization.
5. Choose narrow IP mechanisms for stable infrastructure and provider includes where operationally appropriate.
6. Set qualifiers intentionally; avoid using `+all` or overly broad networks.
7. Keep the record within DNS and protocol constraints.
8. Publish through controlled DNS change management.
9. Test from each legitimate sender and inspect Authentication-Results.
10. Verify DMARC SPF alignment for relevant visible From domains.
11. Monitor SPF failures and `permerror` after rollout.

## Decision points
Use a custom return-path when DMARC SPF alignment matters and the provider supports it. Prefer DKIM as the more forwarding-resilient DMARC path, while keeping SPF correct. Flattening may reduce runtime lookups but creates synchronization risk and should be automated if used.

## Common failure patterns
Multiple `v=spf1` records, forgotten SaaS senders, lookup-limit violations, `include` confusion with IP inclusion, authorizing entire provider ranges unnecessarily, and testing only DNS syntax rather than real mail.

## Verification
Validate DNS syntax and lookup behavior, send through every authorized path, confirm SPF pass/fail semantics, inspect alignment, and verify unauthorized test infrastructure does not pass.

## Expected output
A minimal justified SPF policy plus evidence for legitimate senders, alignment, and operational monitoring.

## Stop conditions
Stop when sender inventory is incomplete, DNS authority is unavailable, or changing authorization could interrupt business-critical mail without an approved rollout.