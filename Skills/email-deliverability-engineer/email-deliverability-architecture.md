# Email Deliverability Architecture

## Purpose
Design an email delivery system whose identities, traffic classes, reputation controls, observability, and failure handling support dependable inbox delivery without coupling business logic to one provider.

## When to use
Use when creating or materially changing outbound email architecture, adding providers, splitting transactional and bulk traffic, or diagnosing systemic delivery risk. Do not use for isolated template copy edits.

## Inputs
- Sending use cases and criticality
- Expected volume and burst profile
- Domains, subdomains, IP pools, and providers
- Authentication and DNS configuration
- Bounce, complaint, engagement, and placement data
- Compliance and retention constraints

## Preconditions
Identify message classes, ownership, business SLOs, and authoritative sources for recipient consent and suppression.

## Context to inspect
Trace message creation through queueing, provider handoff, SMTP acceptance, mailbox-provider response, event ingestion, suppression, and analytics. Inspect shared infrastructure and reputation boundaries.

## Core knowledge
- Delivery acceptance is not inbox placement.
- Reputation can attach to domains, subdomains, IPs, links, and traffic patterns.
- Transactional traffic usually needs stronger isolation and availability than promotional traffic.
- Authentication, list quality, rate control, observability, and content are interacting controls rather than independent checkboxes.
- Provider redundancy adds operational complexity and can fragment reputation.

## Procedure
1. Classify traffic by purpose, criticality, consent model, and expected volume.
2. Define domain, subdomain, From, Return-Path, DKIM, HELO, and IP identity boundaries.
3. Decide which traffic classes require dedicated reputation isolation.
4. Map providers and failover paths, including event-feedback completeness.
5. Define suppression as a shared authoritative control across all senders.
6. Establish bounce, complaint, throttling, and provider-specific response handling.
7. Define rate controls by mailbox provider, domain, IP pool, and traffic priority.
8. Instrument accepted, deferred, bounced, complained, delivered, opened/clicked where lawful, and placement signals.
9. Define SLOs and alert thresholds for critical traffic.
10. Document DNS dependencies, key rotation, warm-up requirements, and change sequencing.
11. Model provider outage and reputation degradation scenarios.
12. Validate architecture with staged traffic before full rollout.

## Decision points
- Use separate subdomains/IP pools when reputation coupling creates material risk; avoid needless fragmentation at low volume.
- Prefer one well-operated provider over multi-provider complexity unless resilience or capability requirements justify it.
- Treat provider failover as controlled migration, not instant unrestricted rerouting, because cold reputation can worsen delivery.

## Common failure patterns
- Mixing password resets with large marketing campaigns
- Per-provider suppression lists that diverge
- Assuming 250 SMTP acceptance equals successful inbox delivery
- Failover to unwarmed infrastructure
- Missing complaint or deferred-event ingestion
- DNS identities that do not align with visible sender identity

## Verification
Verify authentication alignment, traffic isolation, event completeness, suppression propagation, rate limits, dashboards, alarms, and staged mailbox-provider results. Confirm critical message SLOs with observed production evidence.

## Expected output
An architecture decision set covering identities, routing, reputation boundaries, feedback loops, observability, resilience, and rollout controls.

## Stop conditions
Escalate when ownership of sending domains is unclear, required DNS or provider access is unavailable, consent/suppression authority is ambiguous, or a proposed migration risks high-volume sending from unproven reputation.