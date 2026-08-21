# Observability Platform Rules

## Purpose
Provide trustworthy telemetry capabilities that support workload and platform operations.

## Scope
Applies to logs, metrics, traces, collectors, dashboards, retention, routing, and telemetry access.

## MUST
- Telemetry pipelines MUST define ownership, availability expectations, and failure visibility.
- Sensitive data MUST be filtered or protected according to classification requirements.
- Platform telemetry schemas and labels used for automation MUST be stable or versioned.
- Capacity and retention MUST be managed to avoid silent data loss.

## MUST NOT
- MUST NOT log secrets or authentication material.
- MUST NOT claim observability coverage when critical failure paths are uninstrumented.
- MUST NOT allow unrestricted cross-tenant telemetry access.

## SHOULD
- Prefer consistent correlation identifiers across platform workflows.
- Measure ingestion delay, loss, and cost.

## Exceptions
Reduced telemetry is acceptable for constrained workloads when operational risk and alternate evidence are documented.

## Verification
Use end-to-end telemetry tests, access review, retention inspection, synthetic events, capacity metrics, and dashboard validation.