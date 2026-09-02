# Disk Forensics

## Purpose
Analyze storage media to recover and interpret files, partitions, metadata, deleted content, and persistence artifacts relevant to an investigation.

## When to use
Use after acquiring disks, virtual disks, removable media, or forensic images where file activity, deletion, persistence, or historical state matters.

## Inputs
Forensic image, acquisition metadata, suspected time window, host role, known indicators, and investigative questions.

## Context to inspect
Partition tables, filesystem types, encryption, snapshots, volume managers, user profiles, application data, recycle/trash areas, and unallocated space.

## Core knowledge
Filesystem metadata can reveal creation, modification, access, deletion, allocation, and rename behavior, but timestamp semantics vary by filesystem and application. Deleted data may be partially overwritten. File-carving recovers content without full original context and therefore requires cautious interpretation.

## Procedure
1. Verify image integrity before mounting or parsing.
2. Enumerate partitions, volumes, filesystem types, and anomalies.
3. Identify relevant user and system areas.
4. Extract filesystem metadata and deleted entries.
5. Search known indicators and content patterns.
6. Recover deleted files where justified.
7. Examine persistence, staging, archive, and transfer locations.
8. Correlate file metadata with logs and other evidence.
9. Record parser/tool limitations and ambiguous timestamp semantics.
10. Preserve reproducible queries and exported artifacts.

## Decision points
Use metadata-first analysis for broad timelines; use carving when directory structures are unavailable or deletion is suspected. Avoid assuming recovered carved files belonged to a specific directory or user without corroboration.

## Common failure patterns
Mounting read-write, over-trusting timestamps, ignoring alternate data streams or extended attributes, treating carved data as contextual proof, and overlooking nested virtual disks or encrypted containers.

## Verification
Cross-check findings with multiple artifacts, validate recovered file hashes and headers, and reproduce key conclusions with an independent parser when material.

## Expected output
Evidence-backed disk findings, extracted artifacts, timeline entries, hashes, and documented confidence/limitations.

## Stop conditions
Stop when decryption or proprietary formats require authorization or unavailable tooling, image integrity fails, or interpretation depends on unsupported assumptions.