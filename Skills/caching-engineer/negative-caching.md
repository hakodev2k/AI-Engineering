# Negative Caching

## Purpose
Cache legitimate absence or bounded failure signals to reduce repeated expensive lookups without hiding newly created data or transient recovery.

## When to use
Use for repeated not-found lookups, DNS-like absence, abuse traffic, or expensive deterministic misses.

## Inputs
Not-found semantics, creation frequency, lookup cost, acceptable false-negative window.

## Context to inspect
Inspect source status codes, distinction between absent and failed, create/update flows, and invalidation options.

## Core knowledge
Negative cache entries must distinguish authoritative absence from timeout, permission failure, and transient dependency errors. Negative TTLs are usually shorter because absence can become presence.

## Procedure
1. Define which source outcomes are authoritative negative results.
2. Exclude transient and ambiguous failures.
3. Choose a short TTL from acceptable visibility delay.
4. Include tenant and authorization dimensions in keys.
5. Invalidate negative entries on successful creation when possible.
6. Bound negative-key cardinality against random-key attacks.
7. Instrument negative hits separately.
8. Test create-after-miss and outage behavior.

## Decision points
Use negative caching when miss repetition is meaningful and delayed visibility is acceptable. Avoid it when resources are created frequently and immediate discoverability is required.

## Common failure patterns
Caching 500s as not-found; long negative TTL; attacker-driven cardinality; missing create invalidation; permission-denied cached across principals.

## Verification
Verify newly created resources become visible within the contract and transient failures never become persistent negatives.

## Expected output
A bounded negative-cache policy with explicit eligible outcomes.

## Stop conditions
Stop when source responses cannot reliably distinguish absence from failure.