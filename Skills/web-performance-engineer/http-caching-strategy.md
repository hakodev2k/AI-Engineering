# HTTP Caching Strategy

## Purpose
Design browser and shared-cache policies that reduce repeat latency and bandwidth without serving incorrect or stale user data.

## When to use
Use when static assets refetch unnecessarily, navigations miss cache opportunities, deployments cause stale-content failures, or CDN/browser caching behavior is unclear.

## Inputs
Resource inventory, cache headers, URL/versioning scheme, CDN rules, personalization requirements, deployment model, service-worker behavior.

## Context to inspect
Classify resources as immutable, revalidatable, private, personalized, or dynamic. Inspect `Cache-Control`, validators, `Vary`, CDN overrides, cookies, query parameters, and cache-key composition.

## Core knowledge
Long freshness is safe for content-addressed immutable assets; mutable resources need bounded freshness or revalidation. `no-cache` permits storage with revalidation, while `no-store` forbids storage. Shared caches require explicit care around authentication and personalization.

## Procedure
1. Inventory high-impact resources and current hit/miss behavior.
2. Classify each resource by mutability and sensitivity.
3. Use fingerprinted URLs for immutable deployable assets.
4. Set explicit freshness and validators for mutable public resources.
5. Mark personalized or sensitive responses appropriately private/no-store.
6. Minimize unnecessary `Vary` dimensions.
7. Align CDN and origin policy; document intentional overrides.
8. Test deployment invalidation and rollback scenarios.
9. Verify browser reload, navigation, and shared-cache behavior.
10. Monitor hit ratio, revalidation, stale responses, and origin load.

## Decision points
Prefer versioned URLs over purge dependence for static assets. Use stale-while-revalidate only where temporary staleness is acceptable. Do not cache authenticated content merely for performance.

## Common failure patterns
Caching HTML indefinitely without version safety; using `no-store` everywhere; cache keys polluted by irrelevant cookies; weak invalidation strategy; CDN rules silently overriding origin headers; assuming status 200 means network transfer occurred.

## Verification
Inspect response headers and cache status across cold/warm requests, deployment transitions, users, and locations. Confirm stale or cross-user data cannot leak.

## Expected output
A resource-class caching matrix, concrete headers/rules, deployment strategy, and monitoring criteria.

## Stop conditions
Escalate when cache policy affects sensitive data, contractual freshness, or shared infrastructure outside the team's authority.