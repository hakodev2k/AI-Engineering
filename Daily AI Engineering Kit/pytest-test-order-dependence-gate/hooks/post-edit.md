# Hook: Post Edit Verification

## Trigger

After any repair to fixtures, test helpers, state-owning code, or test environment configuration.

## Preconditions

The original evidence-producing sequence is preserved.

## Action

1. Run victim alone.
2. Run exact predecessor+victim reproducer.
3. Run relevant baseline suite.
4. Run `python scripts/order_gate.py --config config/gate-config.json --output .ai-evidence/order-report.json` with the agreed pytest scope.
5. Run repository formatter/linter/build checks required by the parent project.
6. Inspect `git diff --check` and the changed-file list.

## Expected result

All deterministic checks pass with no unintended files and no test-order workaround.

## Failure behavior

Failure returns to the Implementation Agent with preserved command output. Maximum two repair/retest cycles total.

## Blocking

Yes for merge/readiness claims.