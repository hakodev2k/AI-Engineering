# Hook — Pre Sandbox Start

## Trigger
Immediately before consuming persisted sandbox setup/cache state.

## Preconditions
State path and expected classification/schema/runtime owner are known.

## Action
Run:

```bash
python scripts/sandbox_state_guard.py inspect --path "$SANDBOX_STATE" --classification "$STATE_CLASS" --schema-version "$EXPECTED_SCHEMA" --runtime-owner "$RUNTIME_OWNER"
```

Optional integrity envelope:

```bash
python scripts/sandbox_state_guard.py inspect --path "$SANDBOX_STATE" --classification "$STATE_CLASS" --schema-version "$EXPECTED_SCHEMA" --runtime-owner "$RUNTIME_OWNER" --expected-sha256 "$EXPECTED_SHA256"
```

## Expected result
Exit `0` and JSON status `valid` before the state is trusted.

## Failure behavior
Exit `2` means invalid/incompatible rebuildable state: block normal sandbox startup and enter the recovery workflow. Exit `3` means configuration/environment error: block and require investigation. Authoritative/unknown state must never be auto-rebuilt.

## Blocks completion
Yes. A sandbox-dependent task must not continue through a weaker execution mode because this hook failed.
