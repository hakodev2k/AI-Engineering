# Fault Tolerance and Recovery

## Purpose
Design inference serving to contain worker, accelerator, node, network, artifact, and control-plane failures without cascading outages.

## When to use
Use during production-readiness review, architecture changes, or recurring failure investigation.

## Inputs
Failure domains, topology, SLOs, replica counts, state locations, recovery times, dependency map.

## Context to inspect
Health checks, routing, model replicas, distributed collectives, node lifecycle, artifact storage, autoscaler, and regional dependencies.

## Core knowledge
In-flight generation is usually ephemeral state; recovery commonly means terminating affected requests and routing new work to healthy capacity. Multi-GPU groups can fail as a unit. Health must distinguish process liveness from model-serving readiness.

## Procedure
1. Enumerate component and correlated failures. 2. Map blast radius for each. 3. Define liveness/readiness signals. 4. Remove unhealthy capacity quickly without flapping. 5. Ensure sufficient spare capacity for expected failures. 6. Bound distributed collective timeouts. 7. Define in-flight request failure semantics. 8. Test artifact-store and control-plane unavailability. 9. Inject worker/GPU/node failures under load. 10. Measure detection, failover, and recovery times. 11. Update runbooks.

## Decision points
Use redundancy across independent failure domains for strict availability. Do not retry long generations automatically unless product semantics permit duplicate/changed output.

## Common failure patterns
Health checks that ignore model readiness, correlated replicas on one node, infinite collective hangs, restart loops, and assuming autoscaling provides immediate failover.

## Verification
Chaos tests must show bounded blast radius and recovery within SLO assumptions while healthy traffic remains serviceable.

## Expected output
A failure model, redundancy plan, recovery procedures, and measured failover behavior.

## Stop conditions
Stop if failure domains are unknown, spare capacity cannot cover required scenarios, or request retry semantics are unresolved.