# SDK Governance Rules

## Purpose
Keep telemetry SDK usage consistent, supportable, and safe across codebases.

## Scope
Instrumentation SDK versions, initialization, exporters, processors, auto-instrumentation, and shared wrappers.

## MUST
- Supported SDK versions MUST be defined and upgrades MUST be compatibility-tested before broad rollout.
- Shared initialization MUST enforce required resource metadata, redaction, propagation, and export behavior.
- SDK configuration MUST fail safely when telemetry backends are unavailable.
- Auto-instrumentation MUST be reviewed for data exposure, cardinality, and performance impact.

## MUST NOT
- MUST NOT introduce incompatible SDK versions across tightly coupled components without a migration plan.
- MUST NOT allow telemetry initialization to crash critical workloads unless telemetry is itself a required control.
- MUST NOT enable broad automatic capture without inspecting emitted fields.

## SHOULD
- Prefer centrally maintained wrappers or templates for organization-wide invariants while preserving standard protocol compatibility.

## Exceptions
Require documented technical reason, compatibility evidence, ownership, and rollback plan.

## Verification
Inspect dependency manifests, initialization code, emitted samples, upgrade tests, and runtime failure behavior.