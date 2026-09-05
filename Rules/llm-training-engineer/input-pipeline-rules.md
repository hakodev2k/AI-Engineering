# Input Pipeline Rules

## Purpose
Guarantee that training consumes the intended examples, tokens, masks, and sequence boundaries efficiently and correctly.

## Scope
Reading, shuffling, sampling, tokenization, packing, masking, batching, caching, sharding, and prefetching.

## MUST
- Input transformations MUST be deterministic or have controlled, recorded randomness where reproducibility matters.
- Attention masks, loss masks, labels, sequence boundaries, and padding semantics MUST have automated correctness tests.
- Data sharding MUST avoid unintended duplication or omission across workers and epochs/stages.
- Pipeline errors and dropped examples MUST be counted and surfaced.
- Realized token and source distributions MUST be measured after all pipeline transformations.

## MUST NOT
- MUST NOT silently truncate examples in a way that changes target semantics without an explicit policy.
- MUST NOT allow packing to leak loss or attention across boundaries when the training objective requires isolation.
- MUST NOT optimize throughput by bypassing data-integrity checks.

## SHOULD
- Pipelines SHOULD overlap I/O and compute while retaining backpressure visibility.
- Representative decoded batches SHOULD be inspected before major runs.

## Exceptions
Intentional cross-document attention or truncation requires documented objective rationale and targeted validation.

## Verification
Run golden-batch tests, decode sampled batches, compare expected versus realized source/token counts, inspect dropped-record counters, and validate multi-worker shard coverage.