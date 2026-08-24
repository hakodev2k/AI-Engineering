# ML Pipeline Orchestration Rules

## Purpose
Make ML workflows deterministic in control flow, recoverable, observable, and safe to rerun.

## Scope
Covers scheduled/event-driven training, evaluation, packaging, and batch inference workflows.

## MUST
- Pipeline steps MUST declare inputs, outputs, dependencies, retry behavior, timeout, and failure semantics.
- Rerunnable steps MUST be idempotent or use unique immutable outputs.
- Retries MUST distinguish transient failures from deterministic data/code failures.
- Pipeline state and artifacts MUST remain traceable across retries and partial reruns.
- Critical workflows MUST define recovery from partial completion.

## MUST NOT
- Unlimited retries MUST NOT conceal persistent failures.
- A failed evaluation or validation stage MUST NOT be skipped by downstream promotion without an approved waiver.
- Parallel tasks MUST NOT race on shared mutable outputs.

## SHOULD
- Expensive steps SHOULD use safe caching keyed by all material inputs.
- Pipelines SHOULD expose structured status, duration, resource, and failure metrics.

## Exceptions
Manual recovery requires recorded operator actions, preserved lineage, validation of resulting state, and approval for any skipped mandatory gate.

## Verification
Review DAG definitions, retry/timeout configuration, idempotency tests, artifact paths, failure simulations, cache keys, and pipeline telemetry.