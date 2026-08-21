# Repository Context Freshness Workflow

## Trigger
Before planning/editing/review, after repository revision changes, or when resuming a long-running agent task.

## Entry conditions
Repository is readable; task scope is defined; prior context manifest is optional.

## Inputs
Repository root, task scope, prior manifest/context artifacts.

## Stages
1. **Capture** — Context Curator resolves repository revision and source bindings.
2. **Validate** — run `scripts/validate-context-manifest.py`.
3. **Check** — run `scripts/check-context-staleness.py`.
4. **Refresh** — regenerate only stale dependent context.
5. **Recheck** — rerun deterministic staleness check.
6. **Review** — Freshness Reviewer verifies manifest/report independently.
7. **Gate** — run `scripts/evaluate-context-gate.py`.
8. **Proceed or stop** — planning/editing may continue only on `verified`.

## Produced artifacts
- context manifest
- staleness report
- reviewer record
- gate result

## Checkpoints
- revision resolved
- manifest valid
- no blocking stale/missing/unknown sources
- reviewer independent
- gate verified

## Retry rules
Maximum one retry, only for transient read/tool failures. Preserve the original error and first report. Content mismatch, deleted source, scope ambiguity, or reviewer rejection are not automatically retryable.

## Stop conditions
Stop if repository identity/revision is unknown, any required source is unreadable/missing, stale context remains, reviewer is not independent, or gate status is not `verified`.

## Approval points
Human approval is required for downstream dangerous actions such as production deployment, destructive changes, security weakening, breaking contracts, force push, secret/config changes, or irreversible migrations. Fresh context is evidence, not approval.

## Failure paths
- transient tool failure → retry once
- validation failure → correct manifest once, rerun
- stale source → refresh affected context
- missing/unknown source → block and investigate
- reviewer disagreement → preserve evidence and escalate

## Definition of Done
The current repository revision is bound to a validated manifest; all task-relevant context is fresh; independent reviewer status is `verified`; deterministic gate returns `verified`; unresolved risks are recorded.