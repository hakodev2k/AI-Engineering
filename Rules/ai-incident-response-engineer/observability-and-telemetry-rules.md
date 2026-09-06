# Observability and Telemetry Rules

## Purpose
Ensure AI incident responders can reconstruct behavior across application, model, retrieval, tool, and infrastructure boundaries.

## Scope
Applies to logs, metrics, traces, structured AI events, correlation identifiers, and audit telemetry.

## MUST
- Telemetry MUST support correlation across request handling, model invocation, retrieval, tool execution, and downstream effects where relevant.
- Critical AI components MUST expose health and failure signals sufficient to distinguish layer-specific faults.
- Telemetry schemas MUST preserve version identifiers for behavior-affecting artifacts when practical.
- Logging MUST apply redaction and data-minimization controls for prompts, outputs, secrets, and personal data.
- Time synchronization and timestamp semantics MUST be adequate to reconstruct incident ordering.
- Observability gaps discovered during incidents MUST become tracked remediation work when material.

## MUST NOT
- Sensitive content MUST NOT be logged by default merely to simplify debugging.
- High-cardinality AI telemetry MUST NOT be introduced without evaluating operational cost and stability.
- Missing telemetry MUST NOT be replaced with unsupported assumptions in incident conclusions.

## SHOULD
- Use structured events for model routing, policy decisions, retrieval, and tool actions.
- Retention SHOULD match investigation needs and applicable privacy requirements.

## Exceptions
Where full tracing is infeasible, document compensating correlation mechanisms and known diagnostic limits.

## Verification
Inspect telemetry schemas, sample traces, redaction tests, correlation coverage, retention settings, and incident reconstruction exercises.