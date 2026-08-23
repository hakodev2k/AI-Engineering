# Workflow: Structured Output Repair Gate

## Trigger
An AI-generated JSON artifact is about to cross into another agent, script, API, database adapter, CI step, or tool call.

## Entry conditions
A trusted JSON Schema and raw model response exist; downstream execution has not occurred.

## Stages
1. **Capture** — workflow owner preserves raw bytes and SHA-256.
2. **Validate** — deterministic validator checks size, JSON syntax, schema, and blocked sensitive field names.
3. **Classify** — owner classifies failures and records evidence.
4. **Deterministic repair** — only envelope repair is allowed; revalidate immediately.
5. **Contract regeneration** — if needed, perform at most one model regeneration using original context plus sanitized validation errors.
6. **Independent verification** — Output Verifier reruns validation on the exact final candidate.
7. **Handoff** — only `verified` output may reach downstream execution.

## Checkpoints
No candidate proceeds after stages 2, 4, or 5 unless validation succeeds. No validated candidate proceeds to a side-effecting consumer until stage 6 succeeds.

## Retry rules
Maximum two repair/regeneration attempts total. A transient validator/tool failure may be retried once and does not count as content repair if inputs are unchanged. Preserve raw candidate, error report, and hashes for every attempt. Stop immediately on identical repeated validation failure.

## Approval points
Human approval is required to weaken a schema, remove required fields, accept unvalidated output, or change security constraints. The workflow stops before those actions.

## Failure paths
Invalid syntax -> deterministic envelope repair -> validation. Schema/semantic failure -> one contract regeneration -> validation. Sensitive-data finding -> blocked, no automatic regeneration with the sensitive value echoed. Missing/untrusted schema -> blocked. Tool/permission failure -> preserve evidence and stop after one unchanged-input retry.

## Produced artifacts
Raw response, validation reports, repaired/regenerated candidate if any, and final gate result matching `schemas/result.schema.json`.

## Definition of Done
The final artifact independently passes the exact schema and policy, provenance/evidence is preserved, repair count is within bounds, no approval is outstanding, and only the verified file is handed downstream. Otherwise the task is `blocked`, not complete.
