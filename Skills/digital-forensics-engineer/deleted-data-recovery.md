# Deleted Data Recovery

## Purpose
Recover and interpret deleted files and residual data while distinguishing reliable recovery from heuristic reconstruction.

## When to use
Use for suspected deletion, wiping, exfiltration cleanup, ransomware, accidental loss, or historical user activity.

## Inputs
Forensic image, filesystem type, deletion window, target file characteristics, snapshots/backups, and case questions.

## Context to inspect
Allocation metadata, journals, recycle/trash artifacts, snapshots, shadow copies, unallocated space, slack, TRIM/discard behavior, SSD characteristics, and encryption.

## Core knowledge
Deletion semantics differ by filesystem and storage technology. SSD TRIM, copy-on-write filesystems, encryption, and subsequent writes can make recovery partial or impossible. Carving may recover content without trustworthy names or paths.

## Procedure
1. Validate evidence integrity and filesystem geometry.
2. Identify native deletion metadata and recycle/trash mechanisms.
3. Check snapshots, journals, backups, and historical versions before carving.
4. Recover deleted entries using filesystem metadata where possible.
5. Carve unallocated space only for formats relevant to the investigative question.
6. Validate recovered content, metadata, and internal structure.
7. Separate exact recovery, partial recovery, and heuristic attribution.
8. Correlate recovered data with timeline and user/system activity.

## Decision points
Prefer metadata-backed recovery over carving. Stop broad carving when expected evidentiary value is lower than privacy/cost impact.

## Common failure patterns
Assigning carved files incorrect names or owners, ignoring TRIM, treating recovery failure as proof data never existed, and altering original evidence.

## Verification
Hash recovered artifacts, document recovery method, and corroborate attribution with independent metadata.

## Expected output
Recovered evidence with provenance, confidence, limitations, and linkage to investigative questions.

## Stop conditions
Stop when recovery requires destructive operations on the original or scope expands into unrelated personal data without authorization.