# Model Serving Contract Rules

## Purpose
Keep NLP model interfaces stable, validated, and operable across service boundaries.

## Scope
Input/output schemas, model/tokenizer versions, errors, timeouts, retries, compatibility, and rollout.

## MUST
- Serving interfaces MUST define validated input/output schemas, size limits, error semantics, and model version behavior.
- Client-visible contract changes MUST undergo compatibility review.
- Timeouts and retry policies MUST reflect idempotency and downstream capacity.
- Model and tokenizer versions used for each response MUST be observable when needed for diagnosis.

## MUST NOT
- MUST NOT silently change label meanings, score semantics, output fields, or truncation behavior.
- MUST NOT retry non-idempotent downstream actions merely because model inference failed.
- MUST NOT expose internal stack traces or sensitive model/service details to untrusted clients.

## SHOULD
- Contracts SHOULD separate model uncertainty from transport/system failure.
- Rollouts SHOULD support canarying and rapid rollback for material model changes.

## Exceptions
Breaking changes require explicit migration, consumer coordination, approval, and rollback planning.

## Verification
Use schema/contract tests, compatibility fixtures, timeout and failure injection, version telemetry, canary comparison, and consumer integration tests.