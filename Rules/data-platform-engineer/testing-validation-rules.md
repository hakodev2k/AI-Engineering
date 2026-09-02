# Testing and Validation Rules

## Purpose
Provide evidence that platform changes preserve data correctness, compatibility, recoverability, and production behavior.

## Scope
Applies to platform services, pipelines, schemas, connectors, storage, orchestration, infrastructure, and operational procedures.

## MUST
- Tests MUST cover the failure modes and compatibility risks introduced by a change, not only the expected success path.
- Shared platform contracts MUST have integration or contract tests across the boundary they protect.
- Stateful and replayable components MUST test restart, retry, duplicate, partial-failure, and recovery behavior where relevant.
- Test data MUST represent important edge conditions without exposing unauthorized production-sensitive values.
- Production-critical changes MUST have explicit acceptance criteria and evidence that those criteria passed before completion.

## MUST NOT
- MUST NOT treat flaky tests as reliable release evidence; recurring flakiness MUST be isolated and corrected.
- MUST NOT delete regression coverage solely because a test exposes an inconvenient defect.
- MUST NOT rely exclusively on mocks when correctness depends on real engine, serialization, storage, or integration behavior.

## SHOULD
- Prefer deterministic tests and representative ephemeral environments for integration validation.
- SHOULD automate compatibility, replay, schema, policy, and recovery checks in CI where practical.

## Exceptions
Exceptions require documented test limitation, residual risk, alternative evidence, and approval appropriate to production impact.

## Verification
Inspect CI results, test coverage by risk domain, failure-injection evidence, integration environments, regression history, and acceptance records.