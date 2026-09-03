# Pipeline Correctness Rules

## Purpose
Ensure data pipelines produce semantically correct and reproducible outputs.

## Scope
Batch, streaming, ELT, ETL, transformation, orchestration, and materialization logic.

## MUST
- Define correctness invariants for every production pipeline.
- Validate transformations against representative and adversarial data.
- Make failure states observable and distinguish partial from complete processing.
- Preserve deterministic behavior where business semantics require reproducibility.

## MUST NOT
- Silently drop malformed or failed records without an explicit policy and accounting.
- Mark a run successful when required downstream outputs are incomplete.
- Assume orchestration success implies data correctness.

## SHOULD
- Separate business transformations from transport and orchestration concerns.
- Prefer deterministic, replayable transformations.

## Exceptions
Any non-deterministic or lossy behavior requires documented rationale, bounded impact, monitoring, and approval.

## Verification
Use unit tests, integration tests, row-count and invariant checks, sample reconciliation, and run metadata.