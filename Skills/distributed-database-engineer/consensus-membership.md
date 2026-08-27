# Consensus and Membership

## Purpose
Reason safely about consensus groups, leader election, membership changes, and quorum availability.

## When to use
Use for replicated metadata, strongly consistent partitions, cluster resizing, leader instability, or quorum-loss incidents.

## Inputs
Consensus implementation, group membership, failure domains, election metrics, network behavior, maintenance plan.

## Context to inspect
Leader history, term/epoch data, membership configuration, logs, snapshots, timeouts, node placement, and operational procedures.

## Core knowledge
Consensus establishes one ordered history among participating nodes despite failures within its model. Safety depends on quorum intersection and correct membership transitions. Election timeouts must exceed ordinary network variability without making failover unacceptably slow.

## Procedure
1. Identify consensus groups and their ownership.
2. Map members to independent failure domains.
3. Confirm supported membership-change procedure.
4. Review election and heartbeat timing against latency distributions.
5. Inspect leader churn and replication backlog.
6. Plan maintenance without dropping below quorum.
7. Test leader loss and member replacement.
8. Validate snapshot/log recovery.
9. Document quorum-loss recovery separately from ordinary failover.

## Decision points
Use odd voting-member counts when the implementation benefits from majority quorums. Add non-voting replicas for read or recovery capacity when voting members would not improve tolerated failures.

## Common failure patterns
Unsafe simultaneous membership changes, correlated voters, tuning elections from averages instead of tails, manual leader forcing during partitions, and confusing liveness with safety.

## Verification
Demonstrate elections, rolling maintenance, member replacement, and recovery without divergent committed history.

## Expected output
A membership policy, timing rationale, maintenance procedure, and tested failure matrix.

## Stop conditions
Stop before manual quorum override, destructive log repair, or membership surgery not covered by vendor-supported recovery procedures.