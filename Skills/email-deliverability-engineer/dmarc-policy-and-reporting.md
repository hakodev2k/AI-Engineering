# DMARC Policy and Reporting

## Purpose
Deploy DMARC progressively to prevent unauthorized use of visible From domains while preserving legitimate mail and turning aggregate evidence into operational controls.

## When to use
Use for domain protection, authentication modernization, spoofing investigations, or moving from monitoring to enforcement.

## Inputs
From domains, SPF/DKIM results, legitimate sender inventory, aggregate reports, forensic/reporting policy constraints, and DNS access.

## Preconditions
Do not enforce quarantine/reject until legitimate sending paths have been observed and aligned.

## Context to inspect
Review organizational-domain alignment, subdomain policy, `pct`, report destinations, failure sources, forwarded traffic, and third-party senders.

## Core knowledge
DMARC passes when aligned SPF or aligned DKIM passes. Enforcement is a change-management program, not merely a DNS record. Aggregate reports expose source IPs and authentication outcomes but need normalization and trend analysis.

## Procedure
1. Inventory visible From domains and legitimate sender classes.
2. Publish `p=none` with controlled aggregate reporting.
3. Parse reports by source, volume, SPF, DKIM, and alignment.
4. Remediate legitimate non-aligned senders.
5. Identify unauthorized or obsolete sources.
6. Define subdomain behavior explicitly.
7. Raise enforcement gradually using scoped domains or percentage rollout where useful.
8. Monitor rejects, business incidents, and unknown-source trends.
9. Progress to quarantine/reject when residual legitimate failure is acceptably low.
10. Maintain sender inventory and review reports after provider or DNS changes.

## Decision points
Prefer DKIM alignment for forwarded-mail resilience. Use strict alignment only when naming/control requirements justify operational cost. Separate high-risk mail streams by subdomain if independent policy is valuable.

## Common failure patterns
Jumping directly to reject; relying only on SPF; ignoring subdomains; reports sent to unmanaged mailboxes; allowing old vendors indefinitely; assuming enforcement eliminates lookalike-domain abuse.

## Verification
Confirm record syntax, report ingestion, classification of major sources, successful aligned authentication for legitimate traffic, and observed enforcement against controlled unauthorized tests.

## Expected output
A staged DMARC enforcement plan, source inventory, remediation record, and sustained reporting workflow.

## Stop conditions
Stop enforcement progression if significant legitimate traffic remains unexplained or required business senders cannot yet align.