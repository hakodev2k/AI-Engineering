# Hook: Pre Resume

## Trigger
Before any mutation after loading a persisted checkpoint.

## Action
1. Capture current repository/task state with `scripts/capture_resume_state.py`.
2. Run `scripts/resume_integrity_gate.py`.
3. If pass, refresh directly relevant repository context.
4. If fail, stop mutations and invoke Resume Planner.
5. Reconfirm approvals before approval-gated action.

## Expected result
A current evidence-based decision on whether the checkpoint is safe to use.

## Failure behavior
Gate failure blocks direct resumption. Tool failure retries maximum twice if transient.

## Blocking
Yes.
