# Lakehouse Table Management Rules

## Purpose
Protect table correctness and operability where transactional metadata, snapshots, compaction, and concurrent writers govern shared analytical data.

## Scope
Applies to transactional lakehouse tables, snapshot-based datasets, table maintenance, compaction, vacuuming, and metadata evolution.

## MUST
- Table write patterns MUST define concurrency behavior, conflict handling, commit atomicity, and reader visibility.
- Snapshot retention and cleanup MUST preserve the documented rollback, audit, and recovery window.
- Compaction, clustering, and metadata maintenance MUST be scheduled with bounded resource and concurrency impact.
- Table protocol or feature upgrades MUST verify compatibility with every supported reader and writer before activation.
- Destructive maintenance that can remove recoverable history MUST require explicit human approval for production-critical tables.

## MUST NOT
- MUST NOT vacuum or purge snapshots solely to reduce storage cost when recovery or active-reader safety is uncertain.
- MUST NOT enable a table feature that unsupported clients may misinterpret.
- MUST NOT bypass transactional commit mechanisms for convenience.

## SHOULD
- Prefer maintenance based on observed file counts, read amplification, and query evidence.
- SHOULD preserve reproducible snapshots for critical analytical or audit workflows.

## Exceptions
Exceptions require documented compatibility scope, recovery impact, evidence, rollback limitations, and accountable approval.

## Verification
Use concurrent-write tests, snapshot restore tests, client compatibility matrices, table-history inspection, maintenance metrics, and storage lifecycle review.