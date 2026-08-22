# Timeout Budget Review Workflow

## Trigger
Run when a change touches API/client timeout values, retries, polling, downstream HTTP/DB/message calls, background-job deadlines, or cancellation behavior.

## Entry conditions
- Target entrypoint or changed files are known.
- Repository can be inspected.
- No approval-required action has already been taken.

## Inputs
Repository root, target entrypoint, parent SLA/deadline when known, changed files, relevant config, and existing tests.

## Context
Entrypoint, service path, outbound clients, retry handlers, database/message calls, tests, and runtime timeout configuration.

## Stages

### 1. Context and budget discovery
Responsible: Timeout Investigator.

Actions:
1. Identify parent deadline source.
2. Trace downstream call chain.
3. Inventory explicit/implicit child timeouts and retry layers.
4. Run `python3 scripts/scan-timeout-risk.py <repo-root> --json`.

Checkpoint: parent budget is known. If not, stop with `insufficient-evidence`.

### 2. Risk assessment
Responsible: Timeout Investigator.

Actions:
1. Compare each child timeout with remaining parent budget.
2. Account for retry delays and nested retry policies.
3. Check cancellation/deadline propagation.
4. Record evidence-backed findings and proposed remediation.

Checkpoint: findings distinguish facts from hypotheses.

### 3. Approval gate
Responsible: Workflow owner.

Stop for explicit human approval before production config, infrastructure timeout, database schema, breaking API contract, security-control, or large dependency changes.

### 4. Implementation
Responsible: Implementation owner.

Actions:
1. Make the smallest safe change.
2. Prefer a shared deadline/remaining-budget calculation over unrelated constants.
3. Keep retries bounded by the parent deadline.
4. Preserve cancellation propagation.
5. Add or update relevant tests.

Produced artifacts: code/config diff and test changes.

### 5. Test and verify
Responsible: Timeout Verifier.

Actions:
1. Run targeted success-before-deadline tests.
2. Run timeout/deadline exhaustion tests.
3. Run retry-cutoff and cancellation tests when applicable.
4. Re-run the scanner.
5. Inspect the diff for unrelated timeout changes.
6. Validate the assessment with `python3 scripts/validate-assessment.py <assessment.json>`.

### 6. Retry loop
Maximum retries: 2 fix-retest cycles.

Retryable failures:
- Incorrect child timeout calculation.
- Deterministic test failure caused by the current change.
- Scanner finding confirmed as a fixable regression.

Evidence preserved per retry:
- Failed command.
- Exit code/output.
- Relevant diff.
- Changed hypothesis or remediation.

Escalation: after the second unsuccessful fix-retest cycle, stop with `block` and preserve evidence.

Non-retryable failures:
- Missing parent SLA.
- Permission failure.
- Approval-required action.
- Business constraint proving the requested SLA impossible.

## Failure paths
- Tool/transient failure: retry the failed tool at most twice, then stop and preserve output.
- Environment failure: report exact missing dependency or unavailable test service; do not fabricate results.
- Validation failure: correct the assessment contract once evidence is complete; never weaken the validator to obtain pass.
- Approval failure/absence: stop at `needs-approval`.

## Stop conditions
Stop when parent budget is unknown, approval is required, retry budget is exhausted, verification fails, or requested behavior cannot fit inside the deadline.

## Definition of Done
- Parent deadline is identified.
- Downstream timeout/retry/cancellation path is traced.
- Blocking findings are resolved or explicitly approved/accepted by a human.
- Relevant tests pass.
- Scanner results are reviewed.
- Final assessment validates.
- No unresolved blocking risk remains.
