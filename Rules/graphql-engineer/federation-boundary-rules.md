# Federation Boundary Rules

## Purpose
Preserve domain ownership and reliability when composing GraphQL across independently owned subgraphs or services.

## Scope
Applies to federation, schema composition, entity references, ownership directives, cross-subgraph resolution, and gateway contracts.

## MUST
- Each federated field MUST have a clear owning domain and operational owner.
- Entity keys MUST be stable, non-sensitive, and resolvable within documented availability expectations.
- Cross-subgraph dependencies MUST be reviewed for latency, failure propagation, and circular coupling.
- Composition checks MUST run before release and reject incompatible schema changes.
- Authorization responsibilities across gateway and subgraphs MUST be explicit.

## MUST NOT
- MUST NOT use federation to bypass domain service interfaces or create hidden shared-database coupling.
- MUST NOT create cyclic field dependencies that make execution order or ownership ambiguous.
- MUST NOT assume gateway validation alone secures downstream resolvers.

## SHOULD
- SHOULD minimize synchronous cross-subgraph hops on latency-critical operations.
- SHOULD define degraded behavior for optional downstream fields.

## Exceptions
Boundary exceptions require architecture review, documented operational impact, alternatives considered, and accountable-owner approval.

## Verification
Use composition CI, dependency graphs, traces, failure-injection tests, authorization tests, and latency measurements.