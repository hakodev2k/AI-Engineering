# Serving and Integration Rules

## Purpose
Protect model contracts and system reliability when vision models are integrated into applications and services.

## Scope
Model servers, edge runtimes, APIs, queues, streaming pipelines, SDKs, and downstream consumers.

## MUST
- Input and output contracts MUST define shapes, dtypes, color order, ranges, units, coordinate conventions, and error behavior.
- Timeouts, overload behavior, retries, and backpressure MUST be designed for the serving topology.
- Model and preprocessing versions MUST be observable in production responses or telemetry where feasible.
- Breaking contract changes MUST require migration planning and human approval before production execution.

## MUST NOT
- Consumers MUST NOT infer undocumented tensor or coordinate semantics.
- Retries MUST NOT amplify overload without bounded policy and idempotency analysis.

## SHOULD
- Serving interfaces SHOULD decouple consumers from framework-specific model internals.

## Exceptions
Temporary compatibility shims require owner, removal criteria, monitoring, and documented risk.

## Verification
Run contract tests, integration tests, load/failure tests, version checks, and consumer compatibility validation.