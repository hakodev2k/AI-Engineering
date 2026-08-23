# Attack Surface Mapping

## Purpose
Build an evidence-based map of externally and internally reachable attack surfaces so testing effort targets meaningful exposure rather than random endpoints.

## When to use
Use at assessment start, after major infrastructure changes, or when asset ownership is fragmented.

## Inputs
Approved scope, DNS and certificate data, cloud inventories, network ranges, application URLs, API documentation, mobile applications, and architecture context.

## Preconditions
Remain inside approved discovery techniques and rate limits.

## Context to inspect
Inspect domains, subdomains, IPs, ports, protocols, APIs, identity providers, storage endpoints, administrative interfaces, partner connections, and client-distributed artifacts.

## Core knowledge
An attack surface includes reachable technology plus trust relationships and exposed functionality. Discovery results require ownership validation; an observed hostname is not proof that it is authorized for testing.

## Procedure
1. Start from approved seed assets.
2. Enumerate related DNS, certificates, addresses, services, and application entry points using permitted methods.
3. Fingerprint technologies conservatively.
4. Identify authentication and administrative boundaries.
5. Map APIs and non-browser services.
6. Correlate discoveries with inventory and architecture.
7. Classify assets by exposure, privilege, data sensitivity, and business criticality.
8. Flag unknown ownership separately.
9. Prioritize high-value surfaces for deeper testing.
10. Keep the map updated as new evidence appears.

## Decision points
Use passive discovery when active enumeration creates risk. Escalate unknown assets for scope confirmation instead of testing them.

## Common failure patterns
Treating scanner output as authoritative, missing alternate ports or APIs, ignoring identity infrastructure, probing unapproved related domains, and failing to deduplicate shared infrastructure.

## Verification
Cross-check multiple evidence sources, validate ownership, sample discovered services manually, and ensure every high-risk exposed component has a planned test path.

## Expected output
A prioritized attack-surface inventory with evidence, ownership status, exposure, trust boundaries, and testing priority.

## Stop conditions
Stop active discovery on assets with uncertain authorization or when enumeration destabilizes a service.