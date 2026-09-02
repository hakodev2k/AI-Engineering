# Consensus and Leader Election

## Purpose
Apply consensus and leader-election mechanisms correctly when storage metadata or write coordination requires a single agreed history.

## When to use
Use for metadata authorities, shard leadership, membership coordination, distributed locks, or strongly consistent control-plane state. Do not introduce consensus into data paths that do not require global agreement.

## Inputs
State-machine operations, membership model, latency requirements, failure assumptions, persistence model, election policy, and recovery requirements.

## Preconditions
Know which state requires consensus and which state can remain eventually consistent or locally derived.

## Context to inspect
Term/epoch handling, log persistence, quorum calculation, election timers, membership changes, snapshots, fencing, and client redirect/retry behavior.

## Core knowledge
Consensus protocols provide agreement only under their stated assumptions. Safety depends on quorum intersection, monotonic terms or ballots, durable state, and correct membership transitions. Leadership is a lease on authority, not proof that an old leader cannot still execute external side effects.

## Procedure
1. Define the replicated state machine and commands.
2. Identify durable state required across restarts.
3. Define quorum membership and failure tolerance.
4. Specify election and term progression.
5. Define log matching, commit, and apply rules.
6. Design snapshotting and log compaction.
7. Define safe membership-change procedure.
8. Add fencing for side effects outside the consensus log.
9. Specify client behavior across leader changes.
10. Analyze slow, partitioned, and recovering nodes.
11. Test repeated elections and membership transitions.
12. Measure impact on tail latency and availability.

## Decision points
Use an established consensus implementation when possible. Prefer leases only when bounded-clock or expiry assumptions are explicit. Keep consensus state minimal to reduce operational coupling.

## Common failure patterns
Dual leaders without fencing, unsafe membership changes, acknowledging before durable quorum commitment, replaying non-idempotent side effects, election storms, and treating leader discovery as consensus.

## Verification
Verify safety across restart and partition scenarios, committed-log preservation, membership transitions, and fencing. Confirm no acknowledged committed state disappears after leader replacement.

## Expected output
A consensus design or review covering state-machine scope, membership, persistence, election, fencing, recovery, and client semantics.

## Stop conditions
Stop when required external side effects cannot be fenced or when infrastructure assumptions violate the chosen protocol's safety requirements.