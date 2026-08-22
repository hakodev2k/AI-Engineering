# Skill: End-to-End Debugging
Purpose: isolate cross-layer defects quickly without guessing.
Trigger: inconsistent UI/API/data behavior, intermittent defects, production incidents.
Inputs: reproduction steps, timestamps, correlation IDs, logs/traces/metrics, request/response, relevant code/config.
Procedure: establish expected vs actual; reproduce at lowest safe scope; trace one request across client, network, API, dependencies and data; form falsifiable hypotheses; test highest-information hypotheses first; distinguish symptom from root cause; verify fix with regression test and production-safe telemetry.
Parallelism: UI/network, server telemetry, and data-state investigation may run concurrently when sharing one timeline.
Outputs: root-cause record, fix, regression protection, evidence.
Stop: destructive diagnostic action, missing production authorization, or evidence points to another owner requiring escalation.