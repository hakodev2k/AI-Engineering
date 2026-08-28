# Transformation Pipeline Rules

## Purpose
Make BI transformations deterministic, recoverable, and operationally safe.

## Scope
Applies to ELT/ETL jobs, warehouse transformations, scheduled models, and derived datasets.

## MUST
- Transformations MUST be deterministic for the same approved inputs and configuration.
- Pipeline dependencies MUST be explicit rather than inferred from execution order alone.
- Failed jobs MUST leave a detectable state and MUST NOT publish partially valid output as complete.
- Restart behavior MUST be defined for jobs that can be retried after partial execution.

## MUST NOT
- MUST NOT depend on undocumented manual steps for normal production completion.
- MUST NOT overwrite trusted output with known-incomplete data.

## SHOULD
- Pipelines SHOULD isolate staging, transformation, validation, and publication responsibilities.

## Exceptions
Exceptions require documented operational constraints, compensating controls, recovery steps, and owner approval.

## Verification
Inspect orchestration metadata, dependency graphs, retry tests, failure simulations, and publication gates.