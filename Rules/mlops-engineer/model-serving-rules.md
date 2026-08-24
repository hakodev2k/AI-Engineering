# Model Serving Rules

## Purpose
Operate inference services with explicit contracts, bounded resource use, and predictable failure behavior.

## Scope
Covers online inference, batch scoring services, model servers, runtime packaging, and serving dependencies.

## MUST
- Serving interfaces MUST define input/output schemas, validation, error behavior, compatibility expectations, and resource limits.
- Model loading MUST verify the expected artifact identity and compatibility before accepting traffic.
- Timeouts, concurrency limits, and backpressure MUST be defined for networked inference paths.
- Failure behavior MUST be observable and MUST distinguish model, dependency, validation, and infrastructure failures.

## MUST NOT
- A serving process MUST NOT accept arbitrary unvalidated payloads into model execution.
- Mutable model files MUST NOT be replaced in place behind live traffic without a controlled rollout mechanism.
- Unbounded request size or concurrency MUST NOT be allowed on resource-sensitive inference endpoints.

## SHOULD
- Startup/readiness checks SHOULD verify model load and critical dependency readiness.
- Serving runtimes SHOULD be immutable and minimal.

## Exceptions
Alternative controls require documented equivalence, load/failure evidence, and production owner approval.

## Verification
Inspect API schemas, deployment manifests, artifact digests, readiness behavior, load tests, timeout/backpressure configuration, and production error telemetry.