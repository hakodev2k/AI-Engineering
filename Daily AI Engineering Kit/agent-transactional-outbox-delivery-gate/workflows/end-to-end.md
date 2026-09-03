# End-to-End Workflow

## Trigger
Outbox feature work, duplicate/missing event incident, dispatcher change, retry/claim change, or review of AI-generated messaging code.

## Entry conditions
Repository is readable. Task scope is known. No dangerous action is implicitly authorized.

## Inputs
Repository, task/incident description, optional runtime evidence.

## Stages

### 1. Preflight — Repository Explorer
Run `python3 scripts/validate-config.py --config config/outbox-gate.json`. Confirm repository path and inspect relevant structure.

Checkpoint: configuration valid.

### 2. Discovery — Repository Explorer
Follow `skills/outbox-investigation.md`. Produce the full write/delivery map and evidence.

Checkpoint: transaction and dispatcher ownership are known or explicitly unknown.

### 3. Plan — Outbox Planner
Define smallest safe change, tests, scanner expectations, and approval requirements.

Approval point: stop for schema changes, destructive SQL, breaking event contracts, production/config/infrastructure/secret changes, cleanup beyond approved retention, or git history rewriting.

### 4. Execute — Implementation Agent
Follow `skills/outbox-repair.md`.

Produced artifacts: code/test diff and evidence JSON.

### 5. Deterministic checks — Implementation Agent
Run scanner, repository build/test commands, focused tests, and failure-injection tests.

### 6. Verify — Verification Agent
Follow `skills/outbox-verification.md`. Re-run applicable checks and evidence validator.

### 7. Complete
Only when status is `verified` and no required approval is pending.

## Retry rules

- Implementation retries: maximum 2 total.
- Verification retry after a new implementation attempt: maximum 1.
- Tool retry: maximum 1 and only for clearly transient tool failures.
- Retryable: deterministic test failure attributable to the changed boundary, transient local tool failure, scanner finding with a clear code correction.
- Not retryable autonomously: permission failure, ambiguous business semantics, unapproved schema/contract change, production-only reproduction, destructive action.
- Preserve on every failure: command, exit code, relevant output, current hypothesis, changed-file list.

## Failure paths

- Validation failure → stop.
- Permission failure → stop without escalation.
- Approval required → stop before action.
- Retry budget exhausted → stop with evidence.
- Verification blocked by missing external evidence → report blocked, not verified.

## Definition of Done
Transaction atomicity, stable identity, bounded claiming, publish-result handling, retry behavior, duplicate assumptions, tests, scanner disposition, evidence validation, approvals, and independent verification are all evidenced.
