# Skill: Plan Safe Reindex

## Purpose
Plan a complete rebuild when the candidate embedding contract is incompatible with the existing index.

## Process
1. Enumerate breaking manifest fields.
2. Create a new index generation; never reuse the old generation for incompatible vectors.
3. Define source corpus snapshot/version.
4. Define resumable batching and idempotent document/chunk identifiers.
5. Define completeness checks: expected vs embedded vs indexed counts.
6. Define sample vector dimension/norm validation.
7. Define dual-read/canary or isolated validation when supported.
8. Define rollback by retaining the previous index generation.
9. Require approval before production index cutover, deletion, large paid embedding run, or infrastructure/config change.
10. Limit fix/revalidation cycles to two.

## Output
Generation plan, corpus identity, batching strategy, completeness criteria, cutover/rollback plan, approvals.

## Stop conditions
Unbounded cost, destructive-only migration, missing source corpus, unclear index ownership, or required approval absent.
