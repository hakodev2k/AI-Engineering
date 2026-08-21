# Lifecycle Hooks

## Pre-task snapshot
Trigger: before triage.
Preconditions: repository and PR are known.
Action: record current PR head SHA, changed files, and unresolved review comment IDs.
Expected result: immutable starting evidence.
Failure: block execution if PR identity or head cannot be established.
Blocking: yes.

## Post-edit verification
Trigger: after each logical edit batch.
Preconditions: planned files were edited.
Action: run relevant formatter/tests and `python scripts/diff_scope_gate.py` with the approved file set.
Expected result: checks pass and no unintended paths changed.
Failure: preserve command output and return to implementation for at most two retries.
Blocking: yes.

## Pre-resolution gate
Trigger: before marking a comment resolved or replying that it is fixed.
Preconditions: a resolution JSON exists.
Action: run `python scripts/review_gate.py --input <resolution.json>`.
Expected result: exit code 0 and no unresolved evidence gaps.
Failure: keep comment unresolved.
Blocking: yes.

## Final package verification
Trigger: before workflow completion.
Action: run `python scripts/verify_package.py` from the package root.
Expected result: required package files and references exist.
Failure: package/workflow completion is blocked.
Blocking: yes.
