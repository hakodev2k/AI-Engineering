# Workflow: Resolve PR Review Comments

## Trigger
A pull request has unresolved inline review comments, a requested-changes review, or a human asks an agent to address review feedback.

## Entry conditions
- PR and repository are accessible.
- Current PR head SHA can be recorded.
- Review comments and changed files can be retrieved.

## Inputs
PR number, repository, review threads, current diff/head SHA, repository test/build instructions.

## Context
Start with changed files and exact comment hunks. Expand only to nearby implementation, contracts, tests, and dependencies needed to prove the finding.

## Stages

### 1. Snapshot
Owner: workflow owner.
- Record PR head SHA and changed-file list.
- Retrieve unresolved comments and review summaries.
- Block if repository/PR identity cannot be established.

### 2. Triage
Owner: `review-triage-agent`.
- Execute `skills/review-comment-triage.md`.
- Classify every comment.
- Checkpoint: no comment proceeds without evidence.

### 3. Approval gate
Owner: workflow owner/human.
- Compare planned changes with `config/policy.yaml`.
- Stop before approval-required operations until explicit approval exists.

### 4. Implement
Owner: `review-implementation-agent`.
- Execute `skills/review-fix-verify.md` for `needs-change` comments.
- Keep edits within planned files unless new evidence requires re-triage.

### 5. Deterministic checks
Owner: implementation agent.
- Run `python scripts/review_gate.py --input <resolution.json>`.
- Run repository formatter/build/tests appropriate to touched code.
- Run `python scripts/diff_scope_gate.py --allowed-file <path> ...` when Git is available.

### 6. Independent verification
Owner: `review-verification-agent`.
- Compare original reviewer intent with final behavior and evidence.
- Resolved status is allowed only after successful verification.

### 7. Handoff
Owner: workflow owner.
- Produce final resolution record.
- Human or authorized GitHub tool may reply/resolve threads using verified evidence.

## Produced artifacts
- Review-resolution JSON matching `schemas/review-resolution.schema.json`.
- Code changes for accepted feedback.
- Build/test/diff evidence.

## Retry rules
- Maximum two implementation/verification retries per comment/root cause.
- Retryable: incorrect implementation, deterministic test failure attributable to the edit, stale comment context after one refetch.
- Preserve failed command output and previous hypothesis.
- On second failure, mark `blocked` and escalate.

## Failure paths
- Stale PR head before edits: refetch once and re-triage affected comments.
- Permission/tool failure: preserve evidence and mark blocked; do not increase permissions.
- Unrelated baseline test failure: distinguish baseline from introduced failures; do not claim full verification.
- Conflicting reviewer requests: stop affected comments and request human decision in the output record.

## Stop conditions
Approval boundary reached without approval; repeated retry limit reached; PR context cannot be reconciled; security or production safety would be weakened.

## Definition of Done
- Every review comment has a verified terminal status or explicit blocker.
- Relevant tests/build checks pass for resolved code changes.
- Final diff contains no unintended changes.
- Approval-required actions, if any, have explicit approval.
- Resolution JSON satisfies the contract.
