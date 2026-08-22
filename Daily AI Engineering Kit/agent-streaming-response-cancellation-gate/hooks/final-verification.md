# Final verification hook

**Trigger:** after implementation and tests, before completion.

**Preconditions:** intended edits are complete and test commands are known.

**Action:** rerun `python scripts/scan-streaming-cancellation.py <repo> --json`; run target build/tests; inspect `git diff --check`, `git status --short`, and the final diff; hand evidence to `subagents/cancellation-verifier.md`.

**Expected result:** no unexplained scanner findings, build/tests pass, diff check passes, changed files are in scope, and independent verifier returns `status: verified`.

**Failure behavior:** preserve command output and return to implementation for at most two total fix/test retries. After the retry budget is exhausted, stop with `failed` or `blocked`; never report verified success.

**Blocking:** yes.
