# Content and Link Deliverability Review

## Purpose
Review message construction, URLs, headers, and rendering for deliverability risks while avoiding superstition-based “spam word” optimization.

## When to use
Use when a content/template change correlates with filtering, when link reputation is suspect, or before high-volume template rollout.

## Inputs
Raw MIME message, HTML/text bodies, headers, URLs/domains, redirect chain, sending identity, comparative placement data, and prior template version.

## Preconditions
Authentication, recipient quality, and reputation must be evaluated in parallel; content is rarely the only factor.

## Context to inspect
Inspect MIME correctness, multipart structure, encoding, From/Reply-To consistency, unsubscribe mechanisms, URL ownership, redirectors, tracking domains, broken links, deceptive patterns, and rendering.

## Core knowledge
Mailbox filters evaluate many signals. Legitimate semantic content generally should not be rewritten around folklore. Shared or compromised link domains can create reputation coupling. Broken MIME and deceptive link/display mismatches create both trust and security problems.

## Procedure
1. Capture raw before/after messages.
2. Validate MIME, encodings, headers, and text/HTML alternatives.
3. Verify visible sender identity and reply behavior.
4. Enumerate every URL, redirect, image, and tracking host.
5. Check domain ownership, TLS, redirect destination, and unexpected third parties.
6. Confirm unsubscribe/preference mechanisms for applicable mail.
7. Compare message size and clipping/rendering risks.
8. Run controlled A/B evidence only on representative consented recipients.
9. Change one suspected factor at a time.
10. Monitor provider-specific placement and complaint outcomes.

## Decision points
Use branded tracking domains when ownership and reputation isolation justify them. Remove unnecessary redirects. Prefer clear user expectations over attempts to disguise promotional intent.

## Common failure patterns
Keyword superstition, link shorteners of unknown reputation, mismatched anchor destinations, invalid MIME, giant HTML, image-only mail, and changing content while also changing IP/domain.

## Verification
Validate raw MIME, link chain, rendering, unsubscribe behavior, and comparative provider-level results. Confirm no security or accessibility regression.

## Expected output
A prioritized content/link risk assessment with evidence-backed changes.

## Stop conditions
Stop sending if links are compromised, destinations are unsafe, required unsubscribe controls are broken, or test evidence cannot isolate content from larger reputation problems.