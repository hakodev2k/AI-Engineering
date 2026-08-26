# Skill: Observable Convergence Analysis

## Purpose
Engineer long-running agent reliability using observable progress state rather than hidden reasoning or prose claims of progress.

## Trigger
A task runs longer than expected, repeatedly continues, expands work, repeats review/verification, or reports progress without reducing acceptance gaps.

## Inputs
Acceptance ledger, artifact fingerprint, evidence count, new-work count, reviewer findings, model/tool-call counts, finalization intent.

## Preconditions
The task has explicit acceptance rows and a known initial scope. Artifacts can be fingerprinted without exposing secrets.

## Required context
Only task requirements, observable state and produced evidence. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Read-only task state, repository diffs/status, test results, `scripts/convergence_guard.py`, deterministic counters.

## Constraints
- MUST NOT equate tool activity with progress.
- MUST NOT add work unless it maps to a failed acceptance row or approved scope change.
- MUST NOT retry indefinitely.
- MUST preserve security and verification gates while reducing process overhead.

## Procedure
1. Freeze the current required acceptance rows.
2. Establish baseline: open rows, artifacts, evidence, active reviewers and outstanding risks.
3. For each turn, record observable deltas only.
4. Run the convergence guard.
5. If blocked for no progress, form up to two explicit hypotheses: stale task state, wrong tool selection, missing prerequisite, verification-loop defect, or genuine external blocker.
6. Test one hypothesis with a bounded action.
7. Continue only when an artifact/evidence/acceptance delta is produced or a documented blocker is newly established.
8. Finalize only when required rows are closed with evidence.

## Decision points
Continue when measurable progress occurred. Recover when state is stale but repairable. Block/escalate when no-progress budget is exceeded or new work lacks an acceptance owner.

## Expected output
Facts; Assumptions; Evidence; Acceptance state; Hypothesis; Decision; Risks; Verification status.

## Metrics
Acceptance rows closed/turn; no-progress streak; new-work-to-closure ratio; repeated verification count; model calls per closed row; rework rate.

## Verification
Independent verifier confirms the final acceptance ledger against artifacts/tests and checks that work expansion stayed within policy.

## Failure handling
Detection: guard exit 3. Evidence: ledger plus artifact/test state. Retry: maximum two recovery hypotheses. Fallback: checkpoint and stop autonomous continuation. Escalation: human/platform owner with exact blocking row. Stop: exhausted retries, irreversible-risk boundary, or missing authority.
