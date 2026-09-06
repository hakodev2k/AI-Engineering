# Ordering and Sequencing Rules

## Purpose
Preserve the ordering guarantees required to reconstruct source state correctly.

## Scope
Transaction order, per-key order, partitions, sequence tokens, and concurrent changes.

## MUST
- The guaranteed ordering scope MUST be explicitly documented.
- Events for the same logical key MUST preserve source order when downstream correctness depends on it.
- Partitioning changes MUST be evaluated for ordering impact.
- Sequence comparisons MUST use source semantics rather than wall-clock timestamps when authoritative positions exist.
- Reordering buffers MUST have bounded memory and lateness policies.

## MUST NOT
- MUST NOT claim global ordering when only partition or key ordering exists.
- MUST NOT use ingestion time as a substitute for source commit order without evidence.
- MUST NOT repartition stateful streams without validating ordering consequences.

## SHOULD
- Prefer monotonic source positions for reconciliation.
- Test concurrent updates to the same key.

## Exceptions
Relaxed ordering requires documented consumer tolerance and correctness proof.

## Verification
Inspect partition keys, sequence metadata, concurrency tests, replay results, and consumer assumptions.