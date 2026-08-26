# DNS Troubleshooting Rules

## Purpose
Drive DNS diagnosis from evidence instead of assumptions.

## Scope
Resolution failures, stale answers, latency, SERVFAIL, NXDOMAIN, delegation, and application complaints.

## MUST
- Investigation MUST identify the query name, type, client context, resolver path, expected answer, and observed answer.
- Engineers MUST separate authoritative state from cached resolver state.
- Hypotheses MUST be tested with targeted queries, logs, metrics, traces or packet evidence as appropriate.

## MUST NOT
- MUST NOT make broad production changes merely because a local cache flush appears to help.
- MUST NOT conclude DNS is healthy from a single successful lookup.

## SHOULD
- Troubleshooting SHOULD progress from delegation and authority toward recursion and client behavior unless evidence suggests otherwise.

## Exceptions
Urgent mitigation may precede full diagnosis but must preserve evidence and record rationale.

## Verification
Review query transcripts, timestamps, resolver selection, authoritative responses, logs, metrics, and packet captures when needed.