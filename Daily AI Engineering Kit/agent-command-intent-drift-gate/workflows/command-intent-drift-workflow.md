# Command Intent Drift Workflow

## Trigger
Use when an AI agent or automation is about to perform a command/tool action whose arguments, target, environment or side effects can materially change risk or outcome.

## Entry conditions
- requested outcome is known;
- relevant repository/resource context is accessible;
- command has not yet executed.

## Inputs
Task request, target/environment evidence, command policy, repository/config context, tool capabilities, approvals when applicable.

## Flow

```text
Trigger
  ↓
Gather authoritative target/environment context
  ↓
Command Planner creates reviewed intent
  ↓
Fingerprint intent
  ↓
Independent review when required
  ↓
Materialize exact execution request
  ↓
Deterministic drift evaluation
  ├─ blocked → stop / one re-plan max
  ├─ review-required → new review bound to current intent
  └─ pass
  ↓
Final pre-dispatch gate
  ↓
Execute
  ↓
Collect execution + outcome evidence
  ↓
Final verification gate
  ↓
Verified complete
```

## Stages

### 1. Context
Responsible: Command Planner.
Inspect only relevant repository files, runbooks, resource identifiers, current environment and tool documentation. Separate facts, hypotheses and unresolved questions.

### 2. Intent contract
Responsible: Command Planner.
Follow `skills/capture-reviewed-command-intent.md`. Produce an intent conforming to `schemas/command-intent.schema.json`. Generate its fingerprint with `scripts/fingerprint-intent.py`.

### 3. Review and approval
Responsible: Intent Verifier / human approver.
High/critical risk requires independent review. Any action listed by `config/intent-policy.json` under `approval_required_actions` requires explicit human approval before dispatch.

### 4. Materialize execution
Responsible: executing agent/tool adapter.
Produce `schemas/execution-request.schema.json` after all safe-to-inspect substitutions. Do not dispatch yet.

### 5. Drift evaluation
Run:

`python scripts/evaluate-command-drift.py --intent intent.json --execution execution.json --policy config/intent-policy.json --output drift-decision.json`

- Exit 0 / `pass`: continue.
- Exit 3 / `review-required`: obtain new review before execution.
- Exit 2 / `blocked`: do not execute.
- Exit 1 / `error`: treat as tool/validation failure.

### 6. Pre-dispatch verification
Run `scripts/verify-final-gate.py` with exact current artifacts. A `verified` result authorizes only this exact execution request; it does not authorize future variants.

### 7. Execute
Execute once using the already-materialized request. Record timestamps, tool result, command exit/result status, resource identifiers and side-effect evidence.

### 8. Outcome verification
Verify the intended outcome independently where possible. Process exit 0 is execution evidence, not business-outcome proof.

## Checkpoints
- intent fingerprint created;
- required review/approval bound to current intent;
- execution request materialized;
- deterministic drift decision non-blocked;
- final gate verified before dispatch;
- post-execution outcome verified separately.

## Retry rules
- transient read/status failure: maximum 1 retry; preserve first error;
- command-intent re-plan: maximum 1 after new evidence;
- deterministic drift blocker: 0 automatic retries;
- permission failure: 0 privilege-escalation retries; escalate to human;
- execution timeout/unknown external side effect: do not blindly replay; reconcile actual state first.

## Failure paths
- missing target/environment evidence → stop and gather evidence;
- stale/mismatched review fingerprint → new review;
- executable/target/environment drift → blocked;
- added arguments or side-effect escalation → blocked;
- dangerous approval missing → blocked;
- self-review violation → blocked;
- opaque final command → blocked.

## Approval points
Explicit human approval is mandatory before any operation classified by policy as production deployment, destructive SQL, schema/data deletion/change, force push/history rewrite, infrastructure/secret/production-config change, breaking API, security weakening, irreversible migration or large dependency upgrade.

## Produced artifacts
- command intent JSON;
- intent fingerprint;
- optional intent review JSON;
- execution request JSON;
- drift decision JSON;
- execution evidence;
- outcome verification evidence.

## Definition of Done
- exact command intent was captured;
- execution request matched reviewed intent or was re-reviewed;
- no deterministic blocker remained;
- mandatory approval existed;
- high/critical review was independent;
- exact dispatched request was recorded;
- outcome verification is distinct from command execution;
- unresolved risks are preserved;
- no unapproved privilege/environment/target expansion occurred.
