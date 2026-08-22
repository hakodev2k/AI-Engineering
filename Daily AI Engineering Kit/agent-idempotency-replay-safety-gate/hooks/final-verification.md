# Hook: Final Verification

**Trigger:** after implementation and implementation-agent tests, before declaring success.

**Preconditions:** diff, build/test commands, replay identity, and investigation evidence are available.

**Action:** independent verifier runs build/tests; executes project-specific sequential and concurrent replay tests; may use `python scripts/replay-http.py` only against an explicitly safe target; reviews `git diff --check` and changed files; validates the final result against `schemas/investigation-result.schema.json`; runs `python scripts/verify-package.py` when validating this kit itself.

**Expected result:** one logical key creates one durable logical effect under replay/concurrency; different keys remain independent; no unrelated changes; final verdict is evidence-backed.

**Failure behavior:** transient tool failure may retry twice. A functional failure returns to implementation for at most two total fix-test cycles. High/critical unresolved risk, missing approval, or exhausted retries blocks completion.

**Blocks execution:** yes. `Task executed` is not equivalent to `Task verified successfully`.
