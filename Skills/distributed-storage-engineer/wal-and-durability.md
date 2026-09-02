# Write-Ahead Logging and Durability

## Purpose
Design and validate write-ahead logging, persistence ordering, and crash-recovery semantics so acknowledged writes meet explicit durability guarantees.

## When to use
Use when implementing or reviewing WAL behavior, fsync policy, group commit, checkpoints, recovery, or durability-performance trade-offs.

## Inputs
Acknowledgement semantics, filesystem and storage-device behavior, write rate, latency budget, recovery goals, record format, and corruption assumptions.

## Preconditions
Define precisely when a write may be acknowledged and what failures it must survive.

## Context to inspect
Log record format, checksums, sequence numbers, buffering, flush/fsync calls, checkpointing, segment rotation, truncation, replay, and replica acknowledgement.

## Core knowledge
A successful write syscall is not necessarily durable. Correctness depends on ordering between data, metadata, and durable barriers. Group commit amortizes sync cost but changes latency distribution. Recovery must distinguish complete records from torn or partial writes and replay idempotently.

## Procedure
1. Define the durability contract for acknowledged operations.
2. Map each state transition to required persistent records.
3. Specify log record framing, checksums, and sequence ordering.
4. Define buffering and sync policy.
5. Design group commit if throughput requires it.
6. Define checkpoint creation and durable publication.
7. Establish safe log truncation criteria.
8. Implement replay with duplicate-safe semantics.
9. Detect and handle partial tail records.
10. Verify storage/filesystem assumptions on supported platforms.
11. Measure normal write latency and recovery time.
12. Test abrupt restart at persistence boundaries.

## Decision points
Use synchronous durability for data that cannot be reconstructed; allow bounded asynchronous durability only when the business explicitly accepts the loss window. Tune group-commit windows against latency objectives.

## Common failure patterns
Acknowledging before durable persistence, unsafe log truncation, assuming rename or write ordering without verification, replaying operations twice, unchecked log corruption, and checkpoints that are visible before complete.

## Verification
Use controlled abrupt restarts, replay tests, corrupted-tail tests, and durability assertions after acknowledgement. Confirm recovery produces a valid state for every tested interruption point.

## Expected output
A WAL and recovery design with acknowledgement rules, persistence ordering, checkpoint/truncation policy, and measured durability/recovery evidence.

## Stop conditions
Stop if platform persistence guarantees are unknown or the requested latency target conflicts with the required durability contract.