# Pipeline Orchestration

## Purpose
Make ML workflows deterministic, recoverable, and operationally bounded.

## Scope
Training, validation, feature, batch inference, and promotion workflows.

## MUST
- Pipeline steps MUST define inputs, outputs, retries, timeout, idempotency expectations, and failure propagation.
- Re-runs MUST avoid corrupting or duplicating durable outputs.
- Side-effecting steps MUST expose safe recovery behavior.
- Pipeline state MUST be observable without inspecting individual worker machines.

## MUST NOT
- Retries MUST NOT repeat destructive or externally visible actions unless idempotency is guaranteed.
- A downstream stage MUST NOT consume incomplete upstream artifacts as successful output.

## SHOULD
- Long workflows SHOULD checkpoint expensive deterministic stages when reuse is safe.

## Exceptions
Non-idempotent operations require explicit guards, reconciliation procedures, and approval for automated retry.

## Verification
Exercise retries, partial failures, resumptions, duplicate execution, timeout behavior, and artifact completeness in integration tests.