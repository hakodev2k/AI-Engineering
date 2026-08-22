# Hook: Pre-retry Mutation Gate

## Trigger
Immediately before retrying any mutating tool whose prior dispatch may have occurred.

## Preconditions
A ledger JSON record exists with operation id, dispatch state, risk class, and current readback evidence.

## Action
Run the deterministic reconciler. Block retry unless it returns `retry_allowed`. For high-risk records, require `human_approved_retry=true` in addition to verified non-commit.

## Command
```bash
python3 scripts/mutation_reconcile.py operation.json
```

## Expected result
For a safe retry, exit `0` with `action: retry_allowed`. A verified commit returns `action: reuse_committed_result` and must suppress mutation retry.

## Failure behavior
Exit `2` means invalid evidence/configuration and blocks. Exit `3` means ambiguous/unsafe retry and blocks. Invoke `workflows/reconcile-before-retry.md`; do not weaken the gate to make progress.

## Blocking
Yes. This hook is specifically intended to prevent duplicate external side effects after lost continuation.