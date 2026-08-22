# Agent Observability and Tracing

## Purpose
Make agent decisions, tool calls, failures, latency, and cost diagnosable in production.

## When to use
Use for every production agent and during evaluation/debugging.

## Inputs
Workflow topology, trace platform, tool metadata, privacy rules, SLOs, cost model.

## Context to inspect
Existing logs, metrics, distributed tracing, correlation IDs, data classifications, and incident workflows.

## Core knowledge
Agent traces need semantic events beyond ordinary HTTP telemetry: model invocation, tool choice, arguments metadata, state transition, retry, approval, token use, and termination reason.

## Procedure
1. Define a correlation ID across the full run.
2. Emit spans for model, retrieval, tool, and orchestration steps.
3. Record model/tool versions and structured outcomes.
4. Capture latency, tokens, cost, retries, and termination reasons.
5. Redact secrets and sensitive payloads.
6. Add metrics for task success and failure classes.
7. Create dashboards for quality, reliability, and spend.
8. Alert on actionable symptoms, not raw noise.
9. Support trace replay where privacy permits.
10. Link incidents and evaluation regressions to traces.

## Decision points
Store metadata by default; full prompts only when justified and protected. Sample high-volume successful traces while retaining critical failures.

## Common failure patterns
Logging secrets, opaque model calls, missing correlation, unbounded payload storage, and metrics without task outcomes.

## Verification
Use a synthetic failure and prove an engineer can reconstruct the trajectory and root cause from telemetry.

## Expected output
Trace schema, metrics, dashboards, retention policy, and diagnostic runbook.

## Stop conditions
Stop instrumentation that would violate privacy or secret-handling requirements.