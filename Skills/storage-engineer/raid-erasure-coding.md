# RAID and Erasure Coding

## Purpose
Select and operate redundancy schemes that balance usable capacity, fault tolerance, rebuild risk, and performance.

## When to use
Use when designing disk groups, storage pools, distributed object layouts, or reviewing degraded-mode risk.

## Inputs
Device count/capacity, failure rates, rebuild bandwidth, workload, fault-domain topology, durability targets, and replacement times.

## Preconditions
Know the platform's actual failure and rebuild semantics; do not infer them only from generic RAID terminology.

## Context to inspect
Drive classes, controller caches, enclosure/rack domains, spare policy, scrubbing, rebuild priority, and historical failures.

## Core knowledge
Redundancy tolerates specified failures but does not replace backup. Large devices extend rebuild exposure; correlated failures and latent sector errors matter. Erasure coding improves capacity efficiency at CPU/network/reconstruction cost.

## Procedure
1. Define tolerated failure combinations.
2. Map physical failure domains.
3. Estimate rebuild/reconstruction duration under load.
4. Compare mirror, parity, and erasure-code options.
5. Model write penalty and degraded performance.
6. Define spare/replacement policy.
7. Configure patrol reads/scrubbing where appropriate.
8. Test degraded and recovery states.
9. Document data-loss boundaries.

## Decision points
Prefer mirroring for latency-sensitive writes and simple recovery when capacity cost is acceptable. Prefer parity/erasure coding for capacity efficiency when reconstruction and write costs fit the workload.

## Common failure patterns
Putting replicas in one enclosure, insufficient spare capacity, rebuilds saturating production, assuming multiple parity eliminates backup, and mixing heterogeneous devices without understanding consequences.

## Verification
Simulate supported failures, measure degraded SLOs and rebuild duration, and confirm alarms and replacement workflows.

## Expected output
A redundancy policy tied to fault domains, performance, capacity efficiency, and tested recovery behavior.

## Stop conditions
Escalate if required durability cannot be met with available fault domains or recovery time exceeds the risk envelope.
