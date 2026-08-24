# Adversary Infrastructure Analysis

## Purpose
Analyze domains, IPs, certificates, hosting, DNS, and registration relationships to understand adversary infrastructure and identify defensible pivots.

## When to use
Use for campaign expansion, phishing/C2 investigation, proactive hunting, or infrastructure exposure analysis.

## Inputs
Domains, IPs, URLs, certificates, passive DNS, RDAP/WHOIS, hosting data, timestamps, internal sightings.

## Context to inspect
Check first/last seen, resolution history, ASN/hosting, registrar, certificate metadata, naming patterns, co-hosting, and legitimate shared services.

## Core knowledge
Infrastructure is temporal. Relationships valid today may not have existed during the incident; shared hosting and CDNs create false links.

## Procedure
1. Normalize seed observables and incident time window.
2. Enrich with time-aware DNS, registration, certificate, and hosting data.
3. Build candidate pivots from distinctive features.
4. Validate each pivot against timestamps and independent evidence.
5. Separate dedicated from shared infrastructure.
6. Cluster infrastructure conservatively.
7. Identify monitoring and detection opportunities.
8. Record provenance and confidence.

## Decision points
Pivot on rare, operator-controlled features before common hosting attributes. Block only when collateral risk is acceptable.

## Common failure patterns
Present-day DNS used for historical claims, shared-IP attribution, WHOIS overconfidence, unlimited graph expansion, and ignoring sinkholes.

## Verification
Every edge in the infrastructure graph has evidence and temporal validity; high-risk defensive actions are reviewed for collateral impact.

## Expected output
Time-aware infrastructure map with validated pivots, confidence, and defensive recommendations.

## Stop conditions
Stop expansion when pivots become non-distinctive, provenance is unavailable, or collection exceeds authorized scope.