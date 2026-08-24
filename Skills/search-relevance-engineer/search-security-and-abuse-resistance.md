# Search Security and Abuse Resistance

## Purpose
Protect search from unauthorized data exposure, query abuse, ranking manipulation, scraping amplification, and unsafe dynamic query construction.

## When to use
Use when search spans permissioned content, accepts complex user input, exposes ranking-sensitive business data, or is targeted by bots or manipulation.

## Inputs
Authorization model, query API, searchable fields, logs, rate limits, index mappings, ranking signals, abuse reports, threat model.

## Context to inspect
Filter injection paths, document-level security, field exposure, query complexity controls, wildcard/regex usage, tenant routing, caches, personalization data, and bot traffic.

## Core knowledge
Search authorization must be enforced before results are exposed, not merely hidden in presentation. Query expressiveness can create denial-of-service risk. Popularity and behavioral ranking signals can be gamed.

## Procedure
1. Identify searchable data sensitivity and tenant boundaries.
2. Map authorization enforcement from request to candidate generation.
3. Ensure forbidden documents cannot enter visible results, facets, counts, snippets, or suggestions.
4. Validate user input through structured query builders rather than raw query strings.
5. Bound expensive regex, wildcard, fuzzy, aggregation, and candidate parameters.
6. Apply rate limits and bot controls appropriate to endpoint risk.
7. Threat-model ranking manipulation through clicks, reviews, or popularity signals.
8. Protect logs and query text according to data classification.
9. Test cross-tenant and unauthorized facet/count leakage.
10. Monitor abuse patterns and anomalous query cost.

## Decision points
Prefer pre-filter authorization when feasible because post-filtering can leak counts and exhaust candidate sets. Disable expressive query features that do not provide justified user value.

## Common failure patterns
UI-only access control, shared caches across tenants without safe keys, raw search DSL from clients, unbounded wildcard queries, leaking restricted values in autocomplete, and trusting behavioral signals blindly.

## Verification
Run negative authorization tests, tenant-isolation tests, expensive-query limits, cache tests, and abuse simulations; inspect facets, snippets, and suggestions for leakage.

## Expected output
Search threat model, enforced controls, abuse limits, security tests, monitoring rules, and residual risks.

## Stop conditions
Stop and escalate on possible data exposure, unclear authorization semantics, or required security controls that cannot be enforced by the serving architecture.