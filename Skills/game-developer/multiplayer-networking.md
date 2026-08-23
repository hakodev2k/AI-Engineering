# Multiplayer Networking

## Purpose
Design multiplayer simulation with explicit authority, replication, latency handling, bandwidth budgets, and failure behavior.

## When to use
Use for real-time multiplayer, co-op, competitive games, synchronized worlds, or networking defects.

## Inputs
Game mode, player count, latency targets, trust model, transport/framework, server topology, simulation frequency, and platform constraints.

## Context to inspect
Inspect authority, replicated state, RPC/messages, tick rate, serialization, interest management, connection lifecycle, and reconciliation.

## Core knowledge
Networks are delayed, lossy, reordered, and adversarial. Server authority improves trust but increases latency handling needs. Snapshot interpolation, client prediction, reconciliation, lag compensation, and deterministic lockstep solve different classes of problems.

## Procedure
1. Define authoritative owner for every critical state transition.
2. Classify data as reliable/unreliable and persistent/ephemeral.
3. Define network tick and serialization budgets.
4. Add interest management for scalable worlds.
5. Select prediction/interpolation strategy per mechanic.
6. Make commands validated and replay-safe where necessary.
7. Handle reconnect, timeout, host/server loss, and late join.
8. Instrument latency, packet loss, bandwidth, and correction rates.
9. Test under simulated adverse networks.

## Decision points
Use client prediction for latency-sensitive locally controlled actions; interpolation for remote presentation; reliable delivery only when loss cannot be tolerated. Choose dedicated servers when authority, availability, or anti-cheat needs justify cost.

## Common failure patterns
Trusting client outcomes, reliable messages for all traffic, replicating full objects, frame-rate-dependent networking, no late-join state, and testing only on localhost.

## Verification
Run latency/loss/jitter simulations, bandwidth profiling, multi-client soak tests, reconnect/late-join tests, and authority abuse cases.

## Expected output
A documented authority and replication model with measured behavior under realistic network conditions.

## Stop conditions
Stop when trust model, server topology, or latency requirements are unresolved, or required transport behavior is unknown.