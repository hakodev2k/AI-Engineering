# Federation Boundaries

## Purpose
Design federated GraphQL ownership boundaries that keep domains autonomous while providing a coherent composed graph.

## When to use
Use when splitting or extending a graph across independently owned services or subgraphs.

## Inputs
Domain ownership, composed schema, entity relationships, team boundaries, latency goals, and deployment model.

## Context to inspect
Inspect entity keys, ownership directives, cross-subgraph dependencies, composition checks, gateway/router behavior, and service-level authorization.

## Core knowledge
Federation should reflect domain ownership rather than arbitrary technical splitting. Cross-subgraph fields can create runtime hops and coupling. Entity identity must be stable and resolvable without leaking persistence details.

## Procedure
1. Map business domains and owning teams.
2. Assign type/field ownership based on authoritative data and behavior.
3. Define stable entity keys.
4. Minimize cross-subgraph dependency chains.
5. Keep authorization enforceable at the owning boundary.
6. Validate composition continuously.
7. Measure query plans for common operations.
8. Define failure behavior when a subgraph is unavailable.
9. Coordinate schema evolution through registry/checks.
10. Review boundaries when organizational or domain ownership changes.

## Decision points
Keep a monolithic graph when independent ownership and deployment do not justify federation complexity. Duplicate derived/read data only when latency and resilience gains outweigh consistency costs.

## Common failure patterns
Federating by database, circular dependencies, unstable entity keys, gateway-only authorization, chatty cross-subgraph plans, and shared types with unclear ownership.

## Verification
Run composition checks, inspect representative query plans, test subgraph failure, verify authorization, and measure cross-service latency.

## Expected output
A federated ownership model with stable identities and bounded runtime coupling.

## Stop conditions
Stop if domain ownership is disputed or the proposed boundary requires cyclic runtime dependencies that cannot be safely resolved.