# Evidence Preservation and Incident Timeline

## Purpose
Preserve trustworthy evidence and construct a time-ordered incident narrative suitable for diagnosis, audit, and post-incident learning.

## When to use
Use for every material AI incident, especially security, privacy, safety, or agentic side-effect cases.

## Inputs
Logs, traces, prompts, outputs, model versions, retrieval context, tool actions, alerts, deploy events, chat/incident messages, provider events.

## Preconditions
Follow data minimization, legal hold, and access-control policy.

## Context to inspect
Clock synchronization, log retention, sampling, correlation IDs, provider timestamps, redaction pipelines, immutable audit stores.

## Core knowledge
Probabilistic AI behavior is difficult to reconstruct without exact inputs, versions, and context. Evidence handling must balance forensic value with sensitive-data minimization.

## Procedure
1. Establish authoritative incident start and detection times.
2. Preserve representative raw traces with restricted access.
3. Record model, prompt, config, corpus, and tool versions.
4. Capture deployment and feature-flag events.
5. Correlate user requests with tool/external actions.
6. Normalize timestamps and note clock uncertainty.
7. Build a chronological timeline of facts.
8. Label hypotheses separately from verified events.
9. Record evidence gaps and retention limits.
10. Protect integrity of high-value artifacts.

## Decision points
Preserve minimal necessary sensitive content while retaining enough data to reproduce the failure.

## Common failure patterns
Editing logs manually, mixing hypotheses into timeline facts, losing prompt versions, and relying on sampled traces only.

## Verification
Key incident claims are traceable to evidence and timestamps are internally consistent.

## Expected output
A factual incident timeline and evidence index with access restrictions and gaps.

## Stop conditions
Escalate when legal hold, regulated data, or evidence-integrity concerns apply.