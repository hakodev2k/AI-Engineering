# Indicator Lifecycle Management

## Purpose
Create, enrich, score, distribute, expire, and retire indicators of compromise without turning IOC stores into permanent noise.

## When to use
Use when ingesting or operationalizing hashes, domains, IPs, URLs, certificates, email artifacts, or related observables.

## Inputs
Indicators, first/last seen, source, sightings, malware/campaign context, false-positive history, control capabilities.

## Context to inspect
Review indicator stores, SIEM/EDR/DNS/proxy coverage, allowlists, TTLs, enrichment services, and downstream consumers.

## Core knowledge
Indicator value decays. Atomic indicators are easy to change and must carry provenance, confidence, context, scope, and expiration.

## Procedure
1. Normalize and validate syntax.
2. Deduplicate and preserve source provenance.
3. Enrich with passive DNS, WHOIS/RDAP, certificate, sandbox, and internal sightings where authorized.
4. Score confidence, specificity, severity, and freshness.
5. Attach malware, actor, campaign, and technique context only when evidenced.
6. Define detection/blocking suitability separately.
7. Publish with TTL and owner.
8. Monitor false positives and sightings.
9. Re-score, revoke, or expire automatically.

## Decision points
Block only high-specificity indicators with acceptable business risk; use noisy indicators for hunting or enrichment. Prefer behavioral detections when adversaries can rotate infrastructure cheaply.

## Common failure patterns
Permanent blocklists, missing timestamps, context-free hashes, treating enrichment as proof, and propagating revoked indicators.

## Verification
Verify downstream systems receive intended indicators, TTLs work, false positives are measured, and expired indicators are removed.

## Expected output
Operational indicator record with provenance, context, confidence, action, TTL, and lifecycle state.

## Stop conditions
Escalate before blocking shared infrastructure or when evidence cannot support the proposed defensive action.