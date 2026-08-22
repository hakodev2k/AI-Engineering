# Client Contract Design

## Purpose
Design GraphQL capabilities around real client workflows while preventing consumer-specific shortcuts from degrading the shared schema.

## When to use
Use during schema design, frontend integration, mobile rollout, or when repeated client workarounds indicate contract friction.

## Inputs
Client use cases, operation documents, UI/data requirements, release cadence, and existing schema.

## Context to inspect
Inspect actual queries, fragments, network waterfalls, over/under-fetching, client normalization, cache keys, and version support.

## Core knowledge
GraphQL enables clients to select fields, but schema boundaries still determine whether workflows are efficient and understandable. A good shared schema exposes domain capabilities, not one screen's component tree.

## Procedure
1. Gather representative client operations.
2. Identify repeated graph traversals and missing domain concepts.
3. Separate legitimate domain capability from one-client presentation concerns.
4. Design stable IDs and object relationships compatible with client normalization.
5. Avoid forcing clients into sequential request waterfalls.
6. Define mutation payloads that support cache reconciliation.
7. Consider offline/mobile release constraints for evolution.
8. Validate the design with at least one realistic operation.
9. Document intended usage without prescribing unnecessary fields.
10. Monitor operation patterns after release.

## Decision points
Add convenience fields when they represent durable domain semantics or materially reduce expensive orchestration. Keep presentation-only composition in clients when it does not belong to shared domain ownership.

## Common failure patterns
Schema mirroring UI components, backend-for-frontend fields with no durable meaning, unstable IDs, mutations that require full refetches, and optimizing for only the newest client version.

## Verification
Execute representative client workflows, inspect request count and cache reconciliation, and validate compatibility with supported client versions.

## Expected output
A consumer-usable contract that remains domain-oriented and evolvable.

## Stop conditions
Stop when client requirements conflict materially and product/domain ownership must choose semantics.