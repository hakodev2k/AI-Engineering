# Workflow: Impact-Driven Test Selection

## Trigger
A code/configuration/dependency change needs test execution before merge, release, handoff, or agent completion.

## Entry conditions
- Repository is available.
- Base ref is known.
- Current diff can be collected.
- Policy is readable.

## Inputs
Base ref, head/worktree, test inventory, policy, optional component mapping, optional dependency metadata.

## Flow

```text
Collect changes
  ↓
Classify risk
  ↓
Expand component impact
  ↓
Build targeted test plan
  ↓
Validate plan
  ↓
Run selected + mandatory suites
  ↓
Independent coverage review
  ↓
Final gate
  ├─ verified
  ├─ broaden-required → run broader suite → review once more
  └─ blocked
```

## Stages

### 1. Collect changes — Impact Planner
Run `scripts/collect-changes.py`. Produce `artifacts/changes.json` and its SHA-256 fingerprint.

Checkpoint: base ref resolves and changed-file inventory is non-empty unless the task explicitly contains no code change.

### 2. Classify risk — Impact Planner
Apply policy path patterns and change classes. Critical triggers include shared infrastructure, public contracts, dependency/build files, migrations, authentication/authorization, serialization, cross-cutting middleware, test framework configuration, and unknown classifications.

Checkpoint: every changed path has at least one class.

### 3. Expand impact — Impact Planner
Use explicit component mappings first. Add directly coupled components from project references/imports and nearby tests. Record confidence per mapping.

Checkpoint: unresolved impact is preserved explicitly.

### 4. Select tests — Impact Planner
Select targeted tests plus every mandatory suite from triggered risk classes. Set `fallback_mode` to `targeted`, `module`, `integration`, or `full`.

Checkpoint: low confidence or unknown impact cannot remain with `targeted` fallback.

### 5. Validate plan — deterministic hook
Run `scripts/validate-test-plan.py`. Failure blocks execution until the plan is corrected.

### 6. Execute tests — implementation/test runner
Run exactly the planned commands. Record command, exit code, status, discovered/executed/skipped counts, and output reference in an execution report.

Checkpoint: a command exit code of zero is not enough if required tests were not discovered.

### 7. Coverage review — Coverage Reviewer
Review plan, diff binding, risk triggers, test results, and unresolved impact. Output `verified`, `broaden-required`, or `blocked`.

### 8. Final gate — deterministic hook
Run `scripts/evaluate-test-gate.py`.

## Retry rules
- Maximum one automatic retry per test command, only for a documented transient infrastructure/tool failure.
- Test assertion failures, compile failures caused by code, missing test discovery, policy violations, and business-rule failures are not automatically retried.
- If reviewer returns `broaden-required`, exactly one broaden-and-review cycle is allowed. A second request to broaden results in `blocked` and human escalation.
- Preserve first-failure evidence before retry.

## Approval points
Testing itself should be read-only/non-destructive. Any test requiring production access, destructive SQL, real external side effects, infrastructure mutation, security weakening, or irreversible migration requires explicit human approval and must follow applicable safety gates.

## Failure paths
- Cannot resolve base ref → blocked.
- Incomplete change inventory → blocked.
- Unknown impact with unavailable broader suite → blocked.
- Mandatory suite unavailable → blocked.
- Required test failed → blocked.
- Reviewer identity conflicts with high-risk independence rule → blocked.
- Stale plan fingerprint → rebuild plan.

## Produced artifacts
- `artifacts/changes.json`
- `artifacts/test-plan.json`
- `artifacts/test-execution.json`
- `artifacts/coverage-review.json`
- final gate JSON output

## Definition of Done
- Diff fingerprint is current.
- All changed paths are classified.
- Impact mappings contain evidence.
- Mandatory suites were included and executed.
- Selected tests completed with acceptable results.
- No blocking unknown impact remains.
- Independent review is `verified` for high-risk changes.
- Final deterministic gate returns `verified`.