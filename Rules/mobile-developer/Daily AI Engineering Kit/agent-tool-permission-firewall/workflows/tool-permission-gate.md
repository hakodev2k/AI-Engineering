# Tool Permission Gate Workflow

## Entry condition

An AI agent intends to perform a non-trivial tool action that can mutate files, Git state, external systems, databases, cloud resources, dependencies, permissions, or secrets.

## Required inputs

- user task;
- exact intended tool action;
- target resource;
- environment;
- `config/policy.json`;
- repository-specific rules.

## Flow

```text
Intent
  ↓
Permission Planner
  ↓
Action Request
  ↓
Deterministic Policy Check
  ↓
Decision?
  ├─ deny → Stop + report
  ├─ approval_required → Human approval?
  │      ├─ no → Stop
  │      └─ yes → Execute exact scope
  └─ allow → Execute exact scope
                 ↓
              Audit
                 ↓
          Permission Auditor
                 ↓
        verified? ─ no → Stop/report
                 └ yes → Complete
```

## Stages

### 1. Intent capture — Permission Planner

Produce one concrete action request. Do not combine unrelated mutations into one request.

Artifact: `action-request.json`.

Checkpoint: command/tool invocation and target are exact.

### 2. Policy evaluation — deterministic script

Run:

```bash
python scripts/check-policy.py --policy config/policy.json --request action-request.json --output decision.json
```

Artifact: `decision.json`.

Checkpoint: decision is `allow`, `approval_required`, or `deny`.

### 3. Approval boundary — Human

If `approval_required`, present the exact action, target, environment, reason, and risk. Approval is valid only for this request.

Artifact: external or workflow approval record.

### 4. Execution — Primary agent

Execute exactly the approved/allowed action. If the command must change materially, create a new request.

Artifact: tool result including exit status/error.

### 5. Audit — deterministic script

Write request + decision + execution metadata to JSONL.

### 6. Independent verification — Permission Auditor

Compare planned and actual scope and inspect relevant diff/status/result.

Artifact: verification result.

## Retry rules

- Invalid request: regenerate once.
- Policy parse error: no retry unless policy file is corrected.
- Transient tool execution error: retry at most twice if retry does not broaden scope or increase risk.
- Denied action: zero retries using equivalent/obfuscated commands.
- Missing approval: zero execution attempts.
- Audit write failure: retry once.

## Stop conditions

Stop when:

- policy denies the action;
- required approval is absent or rejected;
- policy cannot be loaded safely;
- actual action would exceed declared scope;
- two transient retries fail;
- auditor detects a violation;
- evidence is insufficient to verify execution.

## Human approval points

Mandatory for production, infrastructure, IAM/security, secret changes, database mutation/schema changes, destructive file operations, force pushes/history rewrites, breaking contracts, and broad dependency upgrades.

## Definition of Done

The gated operation is done only when:

1. request exists;
2. deterministic policy decision exists;
3. required approval exists;
4. execution stayed within scope;
5. audit record exists;
6. Permission Auditor returns `verified`;
7. no unresolved policy violation remains.

`Tool executed` is not equivalent to `Tool action verified`.
