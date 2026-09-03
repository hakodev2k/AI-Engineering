# Authentication Context Rules

## Purpose
Ensure identity context is established safely and propagated consistently into GraphQL execution.

## Scope
Applies to request authentication, execution context construction, subscriptions, service calls, and resolver access to principal data.

## MUST
- Authentication MUST complete before protected operations execute.
- Resolver-visible identity context MUST come from validated server-side authentication state, not client-supplied identity fields.
- Subscription authentication MUST define connection lifetime, token expiry, and reauthentication behavior.
- Identity and tenant context MUST propagate explicitly to downstream policy and audit layers.

## MUST NOT
- MUST NOT trust user IDs, roles, or tenant IDs merely because they appear in GraphQL arguments.
- MUST NOT store reusable authentication context in process-global mutable state.
- MUST NOT log raw credentials or bearer tokens.

## SHOULD
- SHOULD minimize identity data placed into execution context.
- SHOULD separate authentication failure from authorization denial in internal telemetry.

## Exceptions
Alternative context mechanisms require documented threat analysis and security approval when they alter trust boundaries.

## Verification
Inspect middleware order, context construction, subscription lifecycle tests, forged-identity tests, and security logs.