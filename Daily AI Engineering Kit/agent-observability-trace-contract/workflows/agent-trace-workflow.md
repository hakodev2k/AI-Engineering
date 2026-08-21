# Agent Trace Workflow

## Trigger
Use when an AI-assisted workflow contains multiple stages/tools/agents, retries, approval points, resumability, or a need for production-grade debugging/audit evidence.

## Entry conditions
- workflow stages and expected verification checks are known
- trace policy is configured
- trace storage path is writable
- reviewer identity can be separated from executor for high-risk runs

## Inputs
Task scope, repository revision, workflow version, agents, tools, approval policy, retry policy, verification checks.

## Flow

```text
Trigger
  ↓
Create trace context
  ↓
Instrument stages/tools
  ↓
Execute + emit events
  ↓
Retry/handoff/approval correlation
  ↓
Verification events
  ↓
Validate trace
  ↓
Independent review
  ↓
Evaluate gate
  ↓
Verified / Blocked / Observability-Incomplete
```

## Stages
1. **Context creation — Trace Instrumentation Agent**
   - create `trace_id`
   - record task/workflow/revision metadata
   - emit `task.started`
2. **Execution instrumentation — Trace Instrumentation Agent**
   - emit stage/tool start and terminal events
   - redact before persistence
   - bind attempts and parent/child relationships
3. **Retry/handoff handling — Workflow owner + instrumentation agent**
   - maximum automatic retry: 1 for transient exporter/tool telemetry failures when side-effect safety permits
   - preserve failed attempt evidence
   - never retry validation, permission, security, business-rule, or approval failures blindly
4. **Approval checkpoint — Human**
   - required before production deployment, destructive SQL, infrastructure/secret/config changes, breaking contracts, security weakening, irreversible migration, or equivalent dangerous actions
   - trace approval request and decision reference
5. **Verification — Verification owner**
   - run actual checks
   - emit `verification.started` and `verification.completed`
   - status must reflect evidence rather than command execution alone
6. **Independent trace review — Observability Reviewer**
   - validate chronology, terminal states, redaction, retries, approvals, verification evidence
7. **Gate — deterministic script**
   - run `scripts/evaluate-trace-gate.py`

## Produced artifacts
- trace JSONL
- validation report
- independent `review.json`
- final gate report

## Checkpoints
- pre-execution: trace context exists
- before retry: previous attempt persisted
- before dangerous action: approval evidence exists
- before completion: verification event exists
- before `verified`: independent review and deterministic gate pass

## Retry rules
- Max telemetry/export retry: 1.
- Retryable: temporary file/exporter availability failure with intact local buffer.
- Not retryable automatically: malformed event, secret leakage, missing approval, permission failure, invalid workflow state, failed verification.
- Preserve all failed-attempt evidence.
- After retry budget is exhausted return `observability-incomplete` or `blocked`.

## Failure paths
- exporter unavailable → retain local JSONL and retry once
- malformed event → block and repair instrumentation
- sensitive data detected → stop persistence/export, rotate/remove leaked secret if applicable with human ownership, then regenerate sanitized evidence
- missing approval → stop action
- missing verification → task may be executed but cannot be verified
- orphan/open spans after crash → mark recoverable spans `abandoned`/`unknown` during resume rather than inventing success

## Definition of Done
- required event classes exist
- validator passes
- no blocking sensitive-data findings
- retries preserve first-failure evidence
- approval-required actions reference approval evidence
- verification checks and results are present
- independent reviewer identity requirement is satisfied for high-risk runs
- final gate status is `verified`
