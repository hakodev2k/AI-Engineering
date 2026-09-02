# Forensic Acquisition

## Purpose
Acquire complete and defensible copies of digital evidence while minimizing source alteration and preserving enough metadata to reproduce the collection.

## When to use
Use for disks, volumes, removable media, virtual disks, memory, cloud exports, log archives, and endpoint collections that require later forensic examination.

## Inputs
Evidence source, platform, storage type, encryption state, collection authority, available tooling, target storage, and time constraints.

## Preconditions
Confirm source identity, available capacity, access permissions, and whether live collection is justified.

## Context to inspect
Disk layout, RAID/LVM, snapshots, encryption, sparse files, virtualization, cloud storage versioning, and volatile-state dependencies.

## Core knowledge
Physical, logical, and targeted acquisition answer different questions. A complete bitstream may capture deleted space and filesystem metadata but can be impractical or unavailable in cloud systems. Tool output must be validated, and acquisition errors must be recorded rather than hidden.

## Procedure
1. Define the investigative question and required acquisition depth.
2. Identify exact source devices, volumes, accounts, or datasets.
3. Select physical, logical, snapshot, or targeted acquisition.
4. Record source identifiers and tool versions.
5. Use write protection where technically appropriate.
6. Acquire to controlled storage with sufficient capacity.
7. Capture error logs and unreadable regions.
8. Compute source/destination hashes when meaningful.
9. Validate mountability or parseability without modifying originals.
10. Seal the original and create working copies.

## Decision points
Prefer full physical acquisition when deleted data and low-level metadata matter; choose logical or targeted acquisition when cloud architecture, scale, or operational constraints make imaging impossible.

## Common failure patterns
Collecting the wrong device, ignoring hidden volumes, omitting metadata, silently skipping read errors, insufficient destination storage, and confusing snapshot consistency with application consistency.

## Verification
Confirm identifiers, expected sizes, hashes, acquisition logs, readable structures, and documented deviations.

## Expected output
Verified forensic image or export, acquisition log, hashes, source metadata, and known limitations.

## Stop conditions
Stop if source identity is uncertain, acquisition risks data loss, encryption credentials require unauthorized access, or the selected method cannot answer the investigation question.