# BIMI and Brand Authentication

## Purpose
Evaluate and deploy BIMI as a post-authentication brand signal without treating it as a substitute for sender reputation or DMARC enforcement.

## When to use
Use after strong SPF/DKIM alignment and DMARC enforcement are stable, when the organization wants supported mailbox providers to display a verified brand indicator.

## Inputs
Brand assets, sending domains, DMARC policy, DNS access, trademark/VMC or supported credential requirements, and mailbox-provider support targets.

## Preconditions
DMARC must meet applicable enforcement requirements. Brand/legal ownership and approved SVG assets must be available.

## Context to inspect
Check organizational domain, DMARC status, BIMI TXT record, SVG Tiny PS compatibility, certificate/credential chain when required, HTTPS hosting, and provider-specific eligibility.

## Core knowledge
BIMI display is discretionary by mailbox providers. Authentication and reputation remain prerequisites. Provider requirements differ and can change; absence of a logo is not itself a delivery failure.

## Procedure
1. Confirm DMARC enforcement and aligned production traffic.
2. Identify provider support and current credential expectations.
3. Prepare a compliant brand asset and validate it structurally.
4. Obtain required brand verification credentials where justified.
5. Host assets over reliable HTTPS.
6. Publish the BIMI selector record.
7. Validate DNS, asset retrieval, and credential chain.
8. Send controlled production-like tests to supported providers.
9. Monitor rendering separately from deliverability metrics.
10. Document renewal and asset-change ownership.

## Decision points
Adopt BIMI only when brand value exceeds certificate, legal, and operational cost. Do not weaken DMARC to accommodate legacy senders; remediate those senders first.

## Common failure patterns
Expecting BIMI to improve poor reputation, malformed SVGs, expired credentials, inconsistent domains, inaccessible asset hosting, and interpreting provider non-display as authentication failure.

## Verification
Validate the BIMI record and assets independently, confirm DMARC prerequisites, inspect provider results, and confirm normal delivery is unchanged.

## Expected output
A validated BIMI deployment with ownership, renewal, and troubleshooting documentation.

## Stop conditions
Stop if DMARC enforcement is not mature, trademark authorization is unresolved, or current provider requirements cannot be satisfied safely.