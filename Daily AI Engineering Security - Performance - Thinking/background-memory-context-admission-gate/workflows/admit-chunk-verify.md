# Workflow: Admit → Chunk → Verify

## Trigger
A background memory job becomes eligible.

## Goal
Produce memory without context overflow or silent coverage loss.

## Baseline
Record source bytes, prior failure/retry state, target model context and prior quota spent.

## Stages
1. Observe source and model capacity.
2. Measure estimated/provider tokens.
3. Diagnose whether failure is deterministic capacity vs transient.
4. Admit if under effective capacity.
5. Otherwise create bounded ordered chunks.
6. Run extraction through the host pipeline.
7. Measure chunk outcomes and artifact coverage.
8. Independent reviewer verifies range coverage and retry classification.

## Checkpoints
Pre-dispatch; after first overflow; after chunk plan; after artifact generation.

## Metrics
Input tokens/job, chunk count, overflow retries avoided, coverage ratio, quota/useful artifact.

## Retry policy
Transient failures follow host policy. Capacity failures change strategy first; maximum two strategy retries.

## Stop conditions
Verified complete/explicitly accepted partial coverage, or escalation after two strategy failures.

## Failure path
Preserve source, mark incomplete memory, surface evidence; never silently declare the pipeline healthy.

## Definition of Done
Capacity measured, chunks bounded, no unchanged overflow retry, artifacts indexed, reviewer PASS.
