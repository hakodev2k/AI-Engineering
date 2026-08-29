# Disk and Filesystem Forensics

## Purpose
Analyze storage media and filesystem metadata to reconstruct file activity, user actions, persistence, and data movement.

## When to use
Use for endpoint compromise, insider activity, deleted-file questions, ransomware, unauthorized software, or suspicious data access.

## Inputs
Forensic image or verified copy, partition layout, filesystem type, case questions, and relevant timestamps.

## Context to inspect
NTFS, APFS, HFS+, ext4, XFS, FAT/exFAT, encryption state, snapshots, volume shadow copies, mount history, and acquisition completeness.

## Core knowledge
Filesystem metadata often survives content deletion and can reveal creation, modification, metadata change, rename, link, and allocation behavior. Timestamp semantics differ by filesystem and tool.

## Procedure
1. Validate image hashes and partition boundaries.
2. Identify filesystems, volumes, encryption, and snapshots.
3. Extract metadata and high-value system/user directories.
4. Examine deleted entries, alternate streams, extended attributes, links, and slack where relevant.
5. Correlate file records with execution, login, browser, and log artifacts.
6. Normalize timestamps with source semantics preserved.
7. Document recovery confidence and tool interpretation limits.

## Decision points
Use metadata-first analysis when scope is broad; content carving when filesystem metadata is unavailable or overwritten. Prefer native metadata over heuristic recovery when both exist.

## Common failure patterns
Treating all timestamps as user actions, ignoring timezone conversion, mounting evidence read-write, trusting recovered filenames blindly, and overlooking snapshots.

## Verification
Cross-check key events using at least one independent artifact or parser when practical.

## Expected output
Filesystem findings, recovered evidence, event correlations, and defensible interpretation notes.

## Stop conditions
Stop when image integrity fails, decryption requires unauthorized credentials, or destructive recovery methods would alter the only evidence copy.