# RAID, Erasure Coding, and Redundancy

## Purpose
Choose and operate redundancy schemes that meet durability, capacity-efficiency, rebuild, and performance requirements.

## When to use
Use when designing arrays, distributed storage pools, failure-domain policies, or reviewing degraded-mode risk.

## Inputs
Device/node count, failure rates, media size, workload, rebuild bandwidth, durability targets, fault domains, capacity targets, and recovery procedures.

## Context to inspect
Controller behavior, scrubbing, hot spares, distributed placement, correlated-failure risks, and backup independence.

## Core knowledge
Mirroring offers simple fast recovery at capacity cost. Parity/erasure coding improves efficiency but adds compute, write amplification, and rebuild complexity. Redundancy is availability engineering, not backup.

## Procedure
1. Define tolerated simultaneous failures and fault domains.
2. Quantify usable-capacity efficiency.
3. Model degraded read/write performance.
4. Estimate rebuild duration at realistic load.
5. Assess exposure to additional failures during rebuild.
6. Place redundancy across independent failure domains.
7. Configure scrubbing and latent-error detection.
8. Define spare/replacement strategy.
9. Test degraded operation and reconstruction.
10. Document what failure classes remain uncovered.

## Decision points
Prefer mirroring for latency-sensitive or fast-recovery workloads; use erasure coding for large-capacity datasets when efficiency justifies repair complexity. Increase parity/fault tolerance as rebuild windows and correlated-failure risk grow.

## Common failure patterns
Assuming independent failures, oversized rebuild domains, no scrubbing, parity without write-penalty analysis, and treating RAID as protection from deletion or corruption.

## Verification
Simulate supported failures, verify data integrity, measure rebuild time and degraded performance, and confirm monitoring detects failed/reconstructing components.

## Expected output
A redundancy policy, usable-capacity model, degraded-mode expectations, repair procedure, and residual-risk statement.

## Stop conditions
Escalate when durability cannot be demonstrated, fault domains are shared unexpectedly, or rebuild time exceeds acceptable exposure.