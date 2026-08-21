# Skill: History Fidelity Analysis

## Purpose
Prove that a transformed or projected agent history preserves the logical content and ordering of the canonical source.

## Trigger
Migration, resume repair, projection rebuild, compaction/export conversion, or any operation replacing a canonical/derived history artifact.

## Inputs
Source JSONL, target JSONL or projection export, optional cursor metadata, compatibility-record classification rules.

## Preconditions
Source is read-only during baseline capture. A backup exists before destructive replacement. Record classification rules are explicit.

## Required context
Source-of-truth definition, transform version, target schema, compatibility aliases, expected synthesized records, and permitted normalization.

## Allowed tools
Read-only file access, hashing, JSON parsing, SQLite read-only queries, deterministic comparison scripts.

## Constraints
Do not infer equality from database integrity alone. Do not silently skip malformed/oversized records. Do not count compatibility aliases as separate logical items unless policy explicitly says they are canonical.

## Procedure
1. Capture source byte size, line count, parse errors, ordinals, and SHA-256 per normalized logical item.
2. Classify records as canonical, compatibility alias, metadata, or intentionally synthesized.
3. Capture the same ledger for the target.
4. Compare canonical fingerprints, multiplicity, order, and ordinal monotonicity.
5. Validate any stored cursor: byte offset must land on a record boundary and expected ordinal must match the record at that boundary.
6. Compare dry-run plan with apply result where both exist.
7. If any unexplained omission, duplicate, reorder, or cursor mismatch appears, return BLOCK.
8. For derived projections, prefer deterministic rebuild from the canonical source over manual patching when feasible.

## Decision points
- Unparsed source record: BLOCK; do not migrate.
- Target-only synthesized item: require explicit allow-rule and provenance.
- Source canonical item missing in target: BLOCK.
- Duplicate canonical fingerprint beyond source multiplicity: BLOCK.
- Cursor mismatch: rebuild projection rather than continue incrementally.

## Expected output
Fidelity report with counts, fingerprints, anomalies, cursor status, and PASS/BLOCK.

## Metrics
Omissions, duplicates, reorder events, parse failures, cursor mismatches, rebuild duration, verified logical-item coverage.

## Verification
A separate verifier reruns the comparison against immutable copies and confirms zero unexplained canonical differences.

## Failure handling
Retry only once for transient I/O. Deterministic content mismatch is never retried blindly.

## Stop conditions
Any source corruption, missing backup for destructive work, unexplained fidelity difference, or second I/O failure.