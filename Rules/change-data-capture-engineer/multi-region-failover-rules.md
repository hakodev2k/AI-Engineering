# Multi-Region and Failover Rules

## Purpose
Prevent duplicate capture, split brain, ordering violations, and data loss during regional or source failover.

## Scope
Active/passive capture, source promotion, fencing, regional brokers, checkpoints, and disaster recovery.

## MUST
- A single-writer or otherwise safe ownership model MUST be defined for each capture stream.
- Failover MUST fence obsolete capture instances before conflicting publication can occur.
- Source promotion MUST map old and new source positions through an explicit recovery procedure.
- Regional recovery objectives MUST be tested against retained source history and downstream durability.
- Post-failover reconciliation MUST verify continuity across the boundary.

## MUST NOT
- MUST NOT run competing capturers against the same logical stream unless duplicate semantics are explicitly safe.
- MUST NOT assume source positions are comparable across promoted instances without engine guarantees.
- MUST NOT fail back without verifying checkpoint compatibility.

## SHOULD
- Automate fencing and ownership leases.
- Exercise region-loss scenarios periodically.

## Exceptions
Manual failover requires incident authority, recorded positions, and post-event validation.

## Verification
Inspect fencing configuration, failover drills, position mappings, duplicate metrics, and reconciliation evidence.