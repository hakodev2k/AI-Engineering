# Workflow: Test Flake Triage

```text
Trigger
  ↓
Pre-task validation
  ↓
Reproduce repeatedly
  ↓
Classify + hypotheses
  ↓
Experiment (max 3 hypotheses)
  ↓
Implement minimal durable fix
  ↓
Post-change repeated tests
  ↓
Independent verification
  ↓
Complete / Re-plan / Escalate
```

## Trigger
A test is suspected to be flaky because identical or materially equivalent runs produce inconsistent results, or it fails intermittently in CI.

## Entry conditions
- Repository and target test are identifiable.
- Safe test execution is possible.
- No production mutation is required for reproduction.

## Inputs
Test identifier/command, failing output, CI job context when available, repository root, optional suspected component.

## Context acquisition
Read only the target test, setup/teardown, fixtures, directly called code, nearby tests, test-runner configuration, and evidence-driven dependencies. Expand context only when a hypothesis requires it.

## Stages
### 1. Validate
Responsible: workflow coordinator. Execute `hooks/pre-task.md`. Produce baseline repository state and safe target command.

### 2. Reproduce
Responsible: `subagents/flake-investigator.md`. Use `skills/reproduce-and-classify.md` and `scripts/run-flake-loop.sh` for `reproduction_attempts` from config. Preserve all logs.

Checkpoint: At least one pass and one failure establishes intermittent reproduction. All-fail means route away from flake triage as likely deterministic. All-pass means `not-reproduced`; do not guess a fix.

### 3. Classify and plan experiments
Responsible: Flake Investigator. Produce at most three evidence-backed hypotheses and one falsifiable experiment per hypothesis.

### 4. Experiment and implement
Responsible: implementation owner using `skills/minimize-and-fix.md`. Test one hypothesis at a time. Diagnostic edits that do not become the fix must be reverted.

Approval point: Stop before test quarantine, major dependency upgrade, production configuration change, destructive data change, or any safety-sensitive action in config.

### 5. Post-change validation
Responsible: implementation owner. Execute `hooks/post-change.md`. Target test runs `post_fix_attempts` times; nearest suite runs once.

### 6. Independent verification
Responsible: `subagents/verification-agent.md`. Verifier does not edit implementation code. Produce `verified`, `rejected`, or `blocked`.

### 7. Complete
Responsible: workflow coordinator. Fill `templates/triage-report.md`, preserve evidence paths, and confirm Definition of Done.

## Retry rules
- Tool/transient failures: maximum 2 retries per failed operation; preserve each error.
- Hypothesis experiments: maximum 3 distinct hypotheses per triage cycle.
- Re-plan after rejected post-fix verification: maximum 2 cycles. A cycle must use new evidence; repeating the same unsuccessful fix is prohibited.
- Test failures are not blindly retried beyond configured evidence runs.

## Failure paths
- Permission/environment failure → `blocked`, record prerequisite, stop.
- Not reproduced → `not-reproduced`, report collected evidence, stop without speculative edit.
- Deterministic failure → hand off to normal bug-fix workflow.
- Approval required → `needs-approval`, stop before action.
- Hypothesis/re-plan budget exhausted → `needs-investigation`, preserve all evidence.

## Produced artifacts
- `.ai/flake-triage/evidence/` run logs and summaries.
- `.ai/flake-triage/report.md` based on `templates/triage-report.md`.
- Repository code/test changes only when evidence supports them.

## Stop conditions
Any approval boundary, unavailable prerequisite, exhausted retry/hypothesis/re-plan budget, deterministic classification, or successful independent verification.

## Definition of Done
- Original failure evidence is preserved.
- Root cause is evidence-backed rather than speculative.
- Fix does not disable or weaken the test to hide the symptom.
- Repeated post-fix target runs have zero failures.
- Nearest relevant suite passes.
- Independent verifier returns `verified`.
- Final diff is scoped and reviewed.
- Remaining risks and any approvals are recorded.
- No blocking failure remains.