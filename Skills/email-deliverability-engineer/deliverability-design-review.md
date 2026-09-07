# Deliverability Design Review

## Purpose
Perform a Senior-level pre-production review of an email-delivery design, identifying risks in identity, reputation, recipient eligibility, capacity, observability, resilience, and operations before they become production incidents.

## When to use
Use for new sending platforms, major providers/migrations, high-volume programs, new traffic classes, new domains/IPs, or material architecture changes.

## Inputs
Architecture diagrams, message inventory, volumes, domains/IPs/providers, DNS/authentication design, recipient eligibility, suppression, event model, SLOs, rollout plan, and failure scenarios.

## Preconditions
The design must be concrete enough to trace at least one message end-to-end. Unknowns should be explicit.

## Context to inspect
Review application enqueueing, routing, provider handoff, SMTP identities, SPF/DKIM/DMARC, DNS ownership, tracking domains, IP pools, list acquisition, suppression, rate control, callbacks, dashboards, alerting, provider dependencies, and rollback.

## Core knowledge
Deliverability is an emergent property of trustworthy traffic, authenticated identities, stable reputation, provider behavior, and operational discipline. Strong reviews test failure boundaries and evidence, not checklist compliance alone.

## Procedure
1. Classify each message stream by purpose, criticality, consent model, and volume.
2. Trace From, Return-Path, DKIM, HELO, IP, links, and provider for every stream.
3. Verify authentication and DMARC alignment strategy.
4. Review reputation isolation and whether fragmentation is justified by volume.
5. Verify canonical suppression, complaints, bounces, and opt-out propagation.
6. Examine queue priority, provider rate limits, retries, idempotency, and duplicate prevention.
7. Validate warming requirements for every new reputation identity.
8. Review event completeness, raw SMTP evidence retention, SLOs, dashboards, and alerts.
9. Model provider outage, throttling, DNS failure, compromised credentials, block, and reputation degradation.
10. Evaluate failover for warm reputation and suppression consistency.
11. Review migration/rollout gates and rollback criteria.
12. Rank findings by user impact, reputation blast radius, likelihood, and reversibility.
13. Require verification evidence for critical assumptions before launch.

## Decision points
Accept complexity only when it buys measurable isolation, resilience, capacity, or governance. Prefer gradual rollout when reputation changes. Block launch for unenforced suppression, broken authentication, unsafe full-volume cold cutovers, or absent critical observability.

## Common failure patterns
Checklist-only review, assuming ESP defaults are sufficient, provider redundancy without warm failover, global metrics masking provider failures, duplicated suppression stores, and launch plans with no rollback.

## Verification
Resolve or explicitly accept every high-risk finding; run authentication tests, suppression tests, queue/failover exercises, event reconciliation, and staged production-like sends.

## Expected output
A prioritized design-review record with decisions, risks, required controls, owners, evidence, and launch gates.

## Stop conditions
Stop approval when critical requirements are unknown, security/consent ownership is unresolved, production safeguards cannot be tested, or proposed behavior would evade mailbox-provider enforcement.