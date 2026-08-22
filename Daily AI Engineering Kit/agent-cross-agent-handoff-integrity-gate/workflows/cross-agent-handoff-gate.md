# Cross-Agent Handoff Gate Workflow

## Trigger
Any transfer of task ownership between agents where downstream work depends on repository facts, prior edits, external evidence, or verification claims.

## Entry conditions
- Producer knows the intended consumer.
- Task and acceptance criteria are identifiable.
- Relevant evidence can be collected or the task can be explicitly marked blocked.

## Inputs
Task, current repository state, evidence, produced artifacts, risk tags, approvals, and verification results already obtained.

## Context
Load only the relevant modules, diffs, logs, tests, APIs, or database evidence needed to support the transfer. Do not reload unrelated repository content.

## Stages

### 1. Context capture — Handoff Producer
Identify task scope, current state, changed/relevant files, evidence sources, open questions, and risk tags.

**Checkpoint:** facts and hypotheses are separated.

### 2. Artifact integrity — Handoff Producer
Compute SHA-256 for material local artifacts and record stable paths. Record evidence IDs for confirmed facts.

**Checkpoint:** all `ready` facts have evidence references.

### 3. Envelope validation — deterministic script
Run:

```bash
python scripts/handoff_gate.py handoff.json --root . --verify-files
```

**Checkpoint:** exit code 0.

### 4. Independent verification — Handoff Verifier
Required when risk includes `production`, `security`, `database`, `infrastructure`, `secrets`, or `breaking-api`. Reproduce critical checks and inspect current state.

**Checkpoint:** producer and verifier identities differ for high-risk verified handoffs.

### 5. Consumer acceptance — Consumer agent
Confirm the task, artifacts, evidence, open questions, and approval boundaries are sufficient to proceed. A consumer may reject a structurally valid handoff if evidence is stale or insufficient.

### 6. Execution or return
- `verified`: consumer may proceed within permissions.
- `ready`: consumer may proceed for normal-risk work but must not misrepresent it as independently verified.
- `blocked`: return to producer/planner with blocking evidence.
- `failed`: return for correction with failed checks preserved.

## Tools
Repository read/search; hashing; `scripts/handoff_gate.py`; tests/build/static analysis; read-only logs/APIs/database inspection appropriate to the task.

## Produced artifacts
A handoff JSON envelope plus the referenced evidence/artifact locations. The workflow does not require copying source artifacts into this package.

## Retry rules
- Deterministic schema/content failure: no blind retry; correct the envelope, then rerun.
- Transient test/tool failure: maximum 2 retries.
- Preserve first and subsequent failure evidence.
- Permission/approval failure: do not retry by escalating permissions; mark `blocked`.
- Artifact hash mismatch: stop and re-establish artifact provenance before retrying.

## Approval points
Explicit human approval is required before production deployment, destructive SQL/data/file deletion, database schema changes, force push/history rewrite, infrastructure changes, secret changes, production configuration changes, breaking API changes, security weakening, irreversible migrations, or large dependency upgrades.

## Failure paths
- Missing evidence → downgrade claims or mark blocked.
- Stale repository state → refresh relevant evidence and rebuild handoff.
- Contradictory evidence → mark failed and return to producer/planner.
- Tool unavailable → preserve error and mark blocked when the check is mandatory.
- Two transient retries exhausted → stop and escalate with evidence.

## Stop conditions
Stop on missing mandatory evidence, unresolved required approval, permission boundary, artifact mismatch, contradictory critical evidence, or exhausted retries.

## Definition of Done
- Required handoff fields exist.
- Facts and hypotheses are separated.
- Ready/verified facts reference evidence.
- Artifact digests are present and match when locally verifiable.
- Required independent verification is complete.
- Verification status matches evidence.
- Approval-required actions remain stopped unless approval exists.
- No blocking failure remains.
