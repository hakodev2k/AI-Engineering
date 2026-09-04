# Observability and Trace Rules

## Purpose
Make agent decisions, tool use, failures, retries, and side effects reconstructable from operational evidence.

## Scope
Applies to production agent runs, orchestration, model calls, tool calls, approvals, retries, and external side effects.

## MUST
- Every run MUST have a stable correlation identifier propagated through workflow steps, model calls, tool calls, and side-effect records.
- Traces MUST distinguish proposed actions from actions actually executed.
- Telemetry MUST capture relevant latency, retry count, failure class, model identity, tool identity, and workflow version without exposing prohibited sensitive data.
- Reliability metrics MUST include successful completion, controlled partial completion, failure, timeout, cancellation, loop termination, and budget exhaustion where applicable.
- Consequential side effects MUST be traceable to the initiating request, authorization context, and execution outcome.
- Telemetry retention MUST follow operational, privacy, and security requirements.

## MUST NOT
- Secrets, authentication tokens, private keys, or unrestricted sensitive prompts MUST NOT be logged.
- Natural-language logs alone MUST NOT be the only evidence for state transitions that can be represented structurally.
- Missing telemetry MUST NOT be interpreted as proof that an action did not occur.

## SHOULD
- Structured events SHOULD use stable schemas and explicit step identifiers.
- Dashboards SHOULD expose reliability trends by workflow, model, dependency, tool, and release version.

## Exceptions
Reduced telemetry requires documented privacy, security, or cost justification and an alternative method for reconstructing consequential failures.

## Verification
Inspect representative traces end to end, validate correlation propagation, test redaction, compare audit records with external side effects, and verify dashboards and alerts against injected failures.