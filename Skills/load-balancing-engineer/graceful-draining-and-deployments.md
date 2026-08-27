# Graceful Draining and Deployments

## Purpose
Remove backends from service without dropping in-flight work or sending new traffic to terminating instances.

## When to use
Use for rolling deployments, autoscaling scale-in, maintenance, node replacement, or shutdown-related errors.

## Inputs
Request duration, connection duration, deregistration delay, readiness semantics, termination grace, and deployment strategy.

## Context to inspect
Inspect orchestrator lifecycle hooks, load-balancer deregistration, application shutdown, keepalive behavior, WebSockets, and deployment events.

## Core knowledge
Safe draining is a coordinated state transition: stop new work, remain available for existing work, then terminate after completion or a bounded deadline. Long-lived streams need explicit policy.

## Procedure
1. Measure request and connection duration percentiles.
2. Map termination signals and readiness changes.
3. Ensure readiness withdrawal precedes process termination.
4. Configure deregistration propagation time.
5. Define drain deadline and long-lived connection behavior.
6. Coordinate application shutdown and proxy timers.
7. Test deployment under representative traffic.
8. Test forced termination after the deadline.
9. Monitor resets and errors around lifecycle events.
10. Document rollback behavior.

## Decision points
Use longer drains for valuable long-running requests; actively migrate or reconnect indefinite streams rather than waiting forever. Balance graceful completion against deployment velocity and stuck resources.

## Common failure patterns
Process exits before deregistration; readiness changes too late; drain shorter than requests; new keepalive requests accepted during drain; no bound on long-lived sessions.

## Verification
Run repeated rolling deployments under load and confirm error rate and connection resets remain within objective.

## Expected output
A deterministic drain lifecycle with validated timings and observability.

## Stop conditions
Stop when application shutdown cannot distinguish new from in-flight work or required drain time exceeds platform termination limits.