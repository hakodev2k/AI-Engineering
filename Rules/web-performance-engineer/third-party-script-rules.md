# Third-Party Script Rules

## Purpose
Control performance, reliability, privacy, and security risk introduced by externally owned browser code.

## Scope
Applies to analytics, advertising, experimentation, chat, consent, monitoring, embeds, tags, and externally hosted scripts.

## MUST
- Measure transfer, execution, main-thread, network, and interaction impact before approving material third-party additions.
- Define an owner and business purpose for every production third-party integration.
- Load non-critical third parties outside the critical rendering and interaction path where feasible.
- Reassess third-party cost after vendor or configuration changes.

## MUST NOT
- Grant a third party unrestricted synchronous access to critical startup without explicit risk review.
- Disable browser security controls to improve third-party compatibility.
- Treat vendor performance claims as evidence without independent measurement.

## SHOULD
- Use containment, delayed activation, server-side alternatives, or sandboxing when they reduce user cost and risk.
- Remove integrations whose value no longer justifies their cost.

## Exceptions
Exceptions require business justification, measured impact, security/privacy review where applicable, mitigation, and accountable approval.

## Verification
Use network and CPU traces, tag inventories, RUM attribution, security configuration inspection, and release diffs.