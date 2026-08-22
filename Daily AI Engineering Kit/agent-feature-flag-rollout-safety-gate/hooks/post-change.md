# Hook: Post-change Verification

**Trigger:** after repository edits and before completion.

**Preconditions:** final request exists; tests have been identified.

**Action:** rerun `python scripts/feature_flag_gate.py --config config/policy.yaml --request <request> --repo-root .`, run relevant project tests, then inspect `git diff --name-only` and `git diff`.

**Expected result:** gate and tests pass; changed files match approved scope; rollback remains available.

**Failure behavior:** block completion and preserve failing output. A single implementation correction cycle is allowed for code/test failures; repeated failure escalates.

**Blocking:** yes.