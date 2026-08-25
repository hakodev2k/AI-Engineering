# Health and Readiness Rules

## Purpose
Expose truthful service availability signals for routing and operations.

## Scope
gRPC health checking, readiness, liveness, dependency health, and draining.

## MUST
- Readiness MUST indicate whether an instance can safely accept intended traffic.
- Liveness MUST detect process conditions that require restart without coupling to every transient dependency failure.
- Health responses MUST change predictably during startup and graceful shutdown.
- Dependency health used for readiness MUST avoid cascading fleet-wide withdrawal without analysis.

## MUST NOT
- MUST NOT report healthy merely because the process accepts TCP connections.
- MUST NOT expose sensitive infrastructure details in unauthenticated health responses.
- MUST NOT use a single undifferentiated health signal when readiness and liveness have materially different semantics.

## SHOULD
- Implement standard gRPC health semantics where ecosystem tooling supports them.
- Draining instances SHOULD become unready before terminating connections.

## Exceptions
Specialized health protocols require equivalent semantics and operational integration.

## Verification
Exercise startup, dependency degradation, overload, drain, and shutdown scenarios; inspect orchestrator and load-balancer reactions.