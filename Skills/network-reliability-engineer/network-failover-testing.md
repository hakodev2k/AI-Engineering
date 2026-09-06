# Network Failover Testing

## Purpose
Prove that redundant network paths, gateways, circuits, DNS, and load-balancing mechanisms actually recover within reliability objectives.

## When to use
Use before launches, after topology changes, during resilience exercises, or when redundancy has never been validated under failure.

## Inputs
Topology, redundancy design, SLOs, failover targets, traffic baselines, maintenance controls, rollback plan, and monitoring.

## Context to inspect
Inspect independence of redundant components, alternate-path capacity, convergence timers, stateful devices, DNS TTLs, and application retry behavior.

## Core knowledge
Configured redundancy is not verified resilience. Failover can expose hidden shared dependencies, asymmetric state, insufficient capacity, or slow convergence.

## Procedure
1. Define the exact component or path to fail.
2. Establish success criteria for loss, convergence, and application recovery.
3. Confirm backup capacity and rollback controls.
4. Capture pre-test telemetry.
5. Remove one dependency in a bounded manner.
6. Observe route, DNS, load-balancer, and application behavior.
7. Measure loss, latency, convergence, and saturation.
8. Restore the primary path and observe failback.
9. Record hidden dependencies and remediation actions.

## Decision points
Use production testing only when blast radius is controlled and business approval exists; otherwise reproduce topology in staging or fault-injection environments.

## Common failure patterns
Testing only administrative status, backups sharing the same provider, insufficient alternate capacity, failback oscillation, and ignoring stateful sessions.

## Verification
Compare measured recovery against SLO/RTO targets and verify both failover and failback paths.

## Expected output
Evidence showing whether the redundancy design meets reliability objectives, plus remediation gaps.

## Stop conditions
Stop if alternate capacity degrades unexpectedly, customer impact exceeds limits, or rollback cannot be guaranteed.