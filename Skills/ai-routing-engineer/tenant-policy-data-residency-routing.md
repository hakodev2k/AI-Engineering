# Tenant Policy and Data Residency Routing

## Purpose
Route requests according to tenant-specific contracts, data residency, deployment eligibility, and service-tier rules without cross-tenant leakage.

## When to use
Use in multi-tenant AI platforms where customers differ by region, approved models, retention requirements, premium tiers, or private deployments.

## Inputs
Authenticated tenant identity, contract policy, allowed regions/providers/models, residency requirements, service tier, data classification, and exception records.

## Preconditions
Tenant identity and policy must come from trusted server-side sources. Never trust client-supplied routing claims without authorization.

## Context to inspect
Tenant policy store, identity middleware, regional endpoints, provider retention terms, private model deployments, audit logs, and policy-cache invalidation.

## Core knowledge
Tenant policy is part of authorization. Routing mistakes can become privacy or contractual incidents even when model output is correct. Cached policy must be versioned and invalidated safely.

## Procedure
1. Resolve authenticated tenant and workload identity.
2. Load authoritative routing policy and policy version.
3. Determine applicable data classification and residency boundaries.
4. Filter providers, regions, and models by tenant approval.
5. Apply service-tier capacity and latency rules.
6. Enforce private-endpoint requirements where configured.
7. Reject ambiguous or missing policy for sensitive workloads.
8. Record tenant policy version with route attribution.
9. Test policy changes and cache invalidation.
10. Run cross-tenant negative tests.

## Decision points
Fail closed on missing policy for regulated tenants. Use shared capacity only when contracts permit it. Prefer explicit allowlists over broad deny rules for restricted tenants.

## Common failure patterns
Client-controlled tenant tier, stale policy cache, cross-region failover that violates residency, and defaulting unknown tenants to the least restrictive route.

## Verification
Automated tests prove each tenant can reach only authorized routes and forced failover remains within residency and contract constraints.

## Expected output
A tenant-aware eligibility layer with authoritative policy resolution, auditability, and negative tests.

## Stop conditions
Stop if tenant identity, residency requirements, or contractual model/provider approvals cannot be established reliably.