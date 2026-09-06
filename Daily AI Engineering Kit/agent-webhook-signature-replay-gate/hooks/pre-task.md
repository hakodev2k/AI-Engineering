# Hook: Pre-task Validation

**Trigger:** before editing webhook verification logic.

**Preconditions:** Python 3.9+, package files available.

**Action:**
`python -m unittest tests/test_webhook_guard.py`

**Expected result:** exit code 0.

**Failure behavior:** preserve output; classify package/environment failure before implementation.

**Blocks execution:** yes if deterministic package tests fail.