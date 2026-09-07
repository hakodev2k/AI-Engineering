# DKIM Signing and Key Management

## Purpose
Establish reliable DKIM signing, alignment, selector lifecycle, and key rotation so recipients can verify message integrity and organizational identity.

## When to use
Use for new sending domains/providers, DKIM failures, key rotation, compromised selectors, or DMARC alignment work.

## Inputs
From domains, signing domains/selectors, provider/MTA configuration, DNS records, key ownership model, and rotation constraints.

## Preconditions
Identify every system that signs or modifies messages after signing.

## Context to inspect
Review `DKIM-Signature`, canonicalization, signed headers, `d=` domain, selector, key size, DNS key, message mutations, and Authentication-Results.

## Core knowledge
DKIM survives forwarding better than SPF but fails when signed content changes. DMARC needs organizational alignment between `d=` and visible From. Selector separation reduces blast radius and supports rotation.

## Procedure
1. Inventory signers and visible From domains.
2. Choose aligned signing domains and unique selectors per provider or trust boundary.
3. Generate/provider-manage strong keys using supported sizes.
4. Publish selector records and validate DNS resolution.
5. Enable signing and capture representative messages.
6. Verify signature validity after all downstream processing.
7. Confirm DMARC alignment.
8. Define dual-key rotation: publish new key, activate new selector, observe, then retire old key after safe overlap.
9. Monitor `dkim=fail`, missing signatures, and unexpected selectors.
10. Revoke compromised keys immediately using an approved incident path.

## Decision points
Provider-managed keys reduce operational burden; customer-managed keys improve control but require disciplined custody and rotation. Sign stable headers; do not rely on headers altered downstream.

## Common failure patterns
Deleting old DNS keys before queued mail clears; one selector reused everywhere; body/footer mutation after signing; signing with an unrelated domain; rotating without observing live traffic.

## Verification
Send representative messages through each path, verify cryptographic pass and DMARC alignment at multiple mailbox providers, and confirm retired selectors disappear from new traffic.

## Expected output
A documented signing and rotation model with validated selectors and monitoring.

## Stop conditions
Stop if key custody is unclear, DNS cannot be safely changed, or downstream mutation prevents stable signing without architecture changes.