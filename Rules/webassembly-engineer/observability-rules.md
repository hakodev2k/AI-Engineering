# Observability Rules

## Purpose
Make production WebAssembly execution diagnosable without violating tenant or data boundaries.

## Scope
Applies to logs, metrics, traces, traps, module identity, host calls, resource usage, and correlation.

## MUST
- Production execution MUST expose module/component identity and version in trusted telemetry.
- Host-call latency and failures MUST be observable for critical integrations.
- Traps and resource-limit terminations MUST be distinguishable from domain errors.
- Cross-boundary requests MUST preserve correlation context where the architecture supports tracing.
- Telemetry MUST redact secrets, credentials, and sensitive guest memory.

## MUST NOT
- Raw linear-memory dumps MUST NOT be logged by default.
- High-cardinality module or tenant data MUST NOT be added to metrics without operational review.
- Observability MUST NOT require granting a guest additional privileged capabilities.
- Production conclusions MUST NOT rely on agent confidence when logs, metrics, traces, or equivalent evidence are available.

## SHOULD
- Track compilation, instantiation, execution, memory, limit rejection, and host-call signals relevant to SLOs.
- Preserve symbols or mapping artifacts for production stack interpretation.
- Sample high-volume traces intentionally.

## Exceptions
Deep diagnostic capture may temporarily collect additional data during an approved incident, with scope, retention, access, and deletion controls.

## Verification
Inspect telemetry schemas and dashboards, trigger known traps and denials, verify correlation and symbolication, and run redaction tests against sensitive inputs.