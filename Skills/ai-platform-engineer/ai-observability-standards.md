# AI Observability Standards

## Purpose
Define platform-wide telemetry standards for model, agent, retrieval, and AI service workloads so teams can diagnose reliability, quality, latency, and cost issues consistently.

## When to use
Use when introducing shared AI telemetry, onboarding teams to a platform, or debugging incidents where request behavior cannot be reconstructed.

## Inputs
- Existing logging, metrics, and tracing standards
- Model/provider APIs
- Privacy requirements
- SLOs
- Cost accounting dimensions

## Context to inspect
Inspect gateway telemetry, application traces, token usage, provider responses, tool calls, retrieval spans, prompt/config versions, error taxonomy, and sensitive data handling.

## Core knowledge
AI observability must correlate conventional distributed traces with behavior-affecting metadata such as model version, prompt version, tool chain, token counts, retrieval results, latency phases, and evaluation signals. Raw prompts and outputs may contain sensitive data and should not be captured indiscriminately.

## Procedure
1. Define a correlation identifier propagated across platform and application boundaries.
2. Define required span types for model, retrieval, tool, and agent operations.
3. Standardize latency, token, error, retry, and cost metrics.
4. Record immutable model and configuration versions.
5. Define safe metadata fields and redaction rules.
6. Establish error taxonomy separating provider, platform, policy, and consumer failures.
7. Add tenant and environment dimensions without exposing sensitive identifiers.
8. Define sampling strategies for high-volume traces.
9. Create baseline dashboards for reliability and usage.
10. Create alert criteria tied to SLOs rather than raw noise.
11. Test telemetry during failures and streaming requests.
12. Document troubleshooting queries and ownership.

## Decision points
Capture content only when justified and protected. Prefer structured metadata over raw payloads. Increase sampling temporarily during incidents instead of retaining all content continuously.

## Common failure patterns
Logging prompts by default, missing model versions, uncorrelated tool calls, metric cardinality explosions, dashboards without SLO context, and tracing only happy paths.

## Verification
Verify trace continuity, redaction, metric accuracy, error classification, cost reconciliation, and usefulness through staged failure scenarios.

## Expected output
A platform observability specification with schemas, dashboards, alerts, privacy rules, and troubleshooting guidance.

## Stop conditions
Stop when privacy policy does not permit the proposed telemetry or critical request metadata cannot be propagated across required boundaries.