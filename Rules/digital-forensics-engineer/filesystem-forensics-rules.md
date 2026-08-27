# Filesystem Forensics Rules

## Purpose
Interpret filesystem artifacts with awareness of implementation-specific semantics and alteration risk.

## Scope
Covers allocated/deleted files, metadata, journals, alternate streams, snapshots, links, and filesystem structures.

## MUST
- Filesystem interpretation MUST account for filesystem type, version, mount behavior, and relevant OS semantics.
- Metadata claims MUST identify the exact field and its known meaning.
- Deleted-file recovery MUST preserve recovery method and confidence in attribution.
- Analysts MUST distinguish filesystem metadata from content-derived facts.
- Snapshot or journal evidence MUST be correlated with active-state evidence when conclusions depend on sequence.

## MUST NOT
- MUST NOT equate a filename with file identity without supporting metadata.
- MUST NOT assume timestamp semantics are identical across filesystems.
- MUST NOT modify evidence by mounting read-write for convenience.

## SHOULD
- Inspect journals, allocation structures, links, extended attributes, and snapshots when relevant.
- Validate parser output with a second method for critical findings.

## Exceptions
When proprietary formats prevent independent validation, document tool dependency, limitations, and corroborating evidence.

## Verification
Review filesystem metadata, parser logs, raw structures for key findings, mount options, hashes, and cross-tool comparison.