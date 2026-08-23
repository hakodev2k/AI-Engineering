# Evidence Collection Rules

## Purpose
Ensure incident conclusions and actions are grounded in reliable evidence.

## Scope
Logs, metrics, traces, events, configuration, deployment history, audit records, customer reports, and runtime inspection.

## MUST
- Timestamp evidence and preserve source, query, scope, and relevant filters so findings can be reproduced.
- Correlate multiple evidence sources before making high-impact causal claims when practical.
- Preserve diagnostic context before destructive cleanup or state-changing investigation.
- Identify telemetry gaps that materially limit confidence.
- Protect sensitive evidence according to access and retention requirements.

## MUST NOT
- Treat absence of logs as proof that an event did not occur when instrumentation may be incomplete.
- Alter evidence to fit a preferred hypothesis.
- Copy secrets, tokens, or unnecessary personal data into incident notes.

## SHOULD
- Prefer immutable or independently corroborated evidence for disputed or high-risk conclusions.

## Exceptions
Emergency mitigation may precede complete collection when delay increases harm; missing evidence and resulting uncertainty MUST be documented.

## Verification
A reviewer should be able to trace important conclusions to retained queries, telemetry, audit records, or other reproducible evidence.