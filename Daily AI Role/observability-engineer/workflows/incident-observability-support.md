# Workflow: Incident Observability Support
Trigger: active production/security incident where telemetry expertise is needed.
Priority: preempts planned observability work.
Stages: confirm incident commander and scope; validate telemetry pipeline health; establish impact window; parallelize metrics/traces/logs/deployment correlation; mark facts vs hypotheses; surface blind spots immediately; avoid risky instrumentation changes during instability unless approved; provide evidence pivots; after containment capture gaps and learning work.
Conflict handling: incident commander owns operational decisions; Observability Engineer owns telemetry interpretation quality.
Stop conditions: sufficient evidence delivered, incident owner releases support, or access/privacy constraints require escalation.
DoD: investigation evidence, uncertainty and telemetry gaps are handed off clearly.
