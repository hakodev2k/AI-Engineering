# Log Correlation Investigation

## Purpose
Build a bounded evidence set for a production incident by correlating logs across services before proposing a root cause.

## When to use
Use when an incident has an approximate time, error, trace/request identifier, affected endpoint, job, message, or service but the failure path is not yet proven.

## Inputs
- Incident time range and timezone.
- Known error text, trace/request/correlation ID, endpoint, job ID, message ID, or affected user/tenant identifier.
- Log files or read-only log-query access.
- `config/correlation-policy.yaml`.

## Preconditions
- Logs are copied to a safe workspace or accessible read-only.
- Production write access is unnecessary and must remain disabled.
- Sensitive values may exist and must be redacted before agent handoff.

## Allowed tools
Read-only repository search, log query/export, shell/Python for local parsing, JSON processing, test/build tools when validating a candidate fix.

## Constraints
- Do not infer causality from temporal proximity alone.
- Do not include secrets in evidence artifacts.
- Do not query outside the configured time window unless evidence explicitly requires expansion.
- Expand the window at most twice, each time recording why.

## Procedure
1. Normalize all timestamps to UTC while preserving original timestamp and source.
2. Identify the strongest primary correlation key available: trace ID, request ID, correlation ID, then operation ID.
3. Collect all events sharing that key within the configured window.
4. If no primary key exists, correlate by service + endpoint/job/message + narrow time window; mark this evidence lower confidence.
5. Order events by normalized timestamp and record service transitions.
6. Identify the first abnormal event, not merely the final thrown exception.
7. Separate facts, hypotheses, and unknowns.
8. For each hypothesis, list the exact event(s) that would confirm or falsify it.
9. Search only the minimal additional context needed to test each hypothesis.
10. Produce `artifacts/log-correlation-evidence.json` using the schema in `schemas/evidence.schema.json`.
11. Hand off the evidence bundle to the Root Cause Analyst.

## Expected output
A redacted, ordered evidence graph with sources, correlation keys, confidence, candidate failure boundary, and open questions.

## Verification
- Every factual claim references at least one evidence event.
- Event timestamps are normalized and source-preserving.
- Secret-like keys are redacted.
- The first abnormal event is distinguishable from downstream symptoms.

## Failure handling
If logs are missing, state exactly which source/time range is absent and stop causal conclusions. If parsing fails, preserve the raw failing line and retry with at most one alternate parser. If correlation remains ambiguous after two bounded expansions, return `inconclusive`.

## Stop conditions
Stop when one hypothesis is supported by direct evidence and competing hypotheses are falsified, or when required evidence is unavailable after bounded expansion.
