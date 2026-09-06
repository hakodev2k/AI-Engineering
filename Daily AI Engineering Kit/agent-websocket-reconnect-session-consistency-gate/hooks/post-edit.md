# Hook: Post-edit Reconnect Check

**Trigger:** after editing connection, reconnect, session, subscription, or replay code.

**Preconditions:** repository-native formatter/tests are available.

**Action:** run formatter/linter, targeted reconnect tests, then `python -m unittest tests/test_validate_reconnect_trace.py` for the copied package.

**Expected result:** all commands pass.

**Failure behavior:** preserve command output; classify as implementation, environment, or transient failure. Retry transient failures at most twice.

**Blocks execution:** yes before final verification.
