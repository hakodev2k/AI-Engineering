# Retention, Expiration, and Deletion

## Purpose
Implement predictable memory lifecycle controls so stale or no-longer-authorized memories stop influencing AI behavior and are removed according to policy.

## When to use
Use when defining TTLs, retention schedules, account deletion, workspace offboarding, or memory cleanup.

## Inputs
Retention policy, memory types, timestamps, legal holds, user deletion requests, storage/index architecture.

## Preconditions
Know which records are mutable, historical, derived, or subject to mandatory retention.

## Context to inspect
Primary stores, vector indexes, caches, replicas, backups, analytics exports, materialized summaries, and event queues.

## Core knowledge
Logical expiration and physical deletion are different controls. Expired data must immediately stop retrieval even if physical cleanup is asynchronous.

## Procedure
1. Define retention rules by memory class.
2. Store explicit expiration metadata.
3. Enforce expiry in retrieval paths.
4. Schedule physical cleanup idempotently.
5. Cascade deletion to derived summaries and indexes.
6. Invalidate caches.
7. Track backup and replication behavior.
8. Respect legal holds when applicable.
9. Record deletion audit evidence without retaining deleted content.
10. Test end-to-end deletion latency.

## Decision points
Use TTL expiration for predictable short-lived state; use event-driven deletion for user or policy revocation requiring prompt removal.

## Common failure patterns
Deleting database rows but not vectors; expired memories remaining in caches; backup policy ignored; deletion jobs without idempotency.

## Verification
Prove deleted or expired memories cannot be retrieved through any supported application path and cleanup completes within policy targets.

## Expected output
A tested lifecycle policy with logical expiry and physical deletion guarantees.

## Stop conditions
Stop when legal retention and deletion obligations conflict without authoritative resolution.