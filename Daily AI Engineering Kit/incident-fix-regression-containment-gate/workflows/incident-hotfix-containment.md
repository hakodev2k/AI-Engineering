# Incident Hotfix Containment Workflow

## Trigger
A production incident or severe pre-production failure requires an urgent code/config hotfix.

## Entry conditions
- Incident ID and severity exist.
- A confirmed symptom or observable failure exists.
- A human incident owner is identifiable for production-impacting approvals.

## Inputs
Incident evidence, repository context, candidate root cause, existing mitigation, test/build tools, rollback mechanism.

## Flow

```text
Incident evidence
  ↓
Hotfix Planner
  ↓
Validate plan
  ↓
Human approval if required
  ↓
Constrained implementation
  ↓
Inspect diff
  ↓
Targeted + negative-control tests
  ↓
Containment Reviewer
  ↓
Final gate
  ↓
Verified / Human approval required / Blocked
```

## Stages

### 1. Capture incident scope
Responsible: Hotfix Planner.

Produce `hotfix-plan.json` from `templates/hotfix-plan.example.json`. Separate facts, hypotheses, and unresolved questions.

Checkpoint: the symptom, severity, affected behavior, allowed paths, forbidden paths, rollback, verification commands, and exceptions are explicit.

### 2. Validate plan
Run:

`python scripts/validate-hotfix-plan.py --plan hotfix-plan.json --policy config/containment-policy.json`

Failure blocks implementation.

### 3. Approval checkpoint
If the plan contains production deploy, destructive operation, schema/infrastructure/secret change, breaking API change, security weakening, or irreversible action, stop until explicit human approval is recorded.

### 4. Implement constrained fix
Responsible: implementation agent or human engineer.

Only edit `allowed_paths`. Avoid unrelated cleanup. Record implementer identity and implementation status separately from verification.

### 5. Inspect final diff
Run:

`python scripts/inspect-hotfix-diff.py --plan hotfix-plan.json --changed-files changed-files.txt --output diff-report.json`

Any unapproved path is blocking.

### 6. Execute verification
Run the exact commands declared in `verification.commands`, including at least one negative-control command. Preserve raw command, exit code, and evidence reference in `verification-result.json`.

Retry policy: maximum 1 retry only for transient runner/network/tool failure. Preserve first failure. Build, test, semantic, business-rule, or policy failures are not retryable automatically.

### 7. Independent containment review
For Sev0/Sev1, reviewer identity must differ from implementer identity. Reviewer checks scope, evidence, rollback readiness, exception expiry, and approval state.

### 8. Final deterministic gate
Run:

`python scripts/evaluate-containment-gate.py --plan hotfix-plan.json --diff diff-report.json --verification verification-result.json --review reviewer-record.json --policy config/containment-policy.json --output containment-result.json`

## Failure paths
- Invalid/incomplete plan → `blocked`.
- Unapproved changed path → `blocked`.
- Verification failure → `blocked`.
- Missing rollback → `blocked`.
- Approval-required action without approval → `human-approval-required`.
- Expired/malformed temporary exception → `blocked`.
- Sev0/Sev1 reviewer not independent → `blocked`.

## Definition of Done
- Valid hotfix plan exists.
- Final diff is entirely contained.
- Targeted and negative-control checks pass.
- Rollback is executable and documented.
- Temporary exceptions have owner, expiry, and follow-up.
- Required approval exists.
- Independent review is complete where required.
- Final gate status is `verified`.