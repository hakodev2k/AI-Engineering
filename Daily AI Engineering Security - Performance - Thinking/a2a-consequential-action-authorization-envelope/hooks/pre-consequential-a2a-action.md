# Hook — Pre Consequential A2A Action

## Trigger
Immediately before a consequential side effect is dispatched.

## Preconditions
Caller authentication and protocol/task/skill authorization are already established; envelope and canonical request files are immutable for this attempt; used-authorization ledger is current.

## Action
```bash
python scripts/verify_authorization_envelope.py "$ENVELOPE" "$REQUEST" \
  --used-authorizations "$USED_AUTHORIZATIONS"
```
Then validate that the executor can atomically consume the authorization ID with the effect or pass a bound idempotency key downstream.

## Expected result
Verifier exits `0`; required high-risk human approval exists; safe consumption/idempotency mechanism is ready.

## Failure behavior
Exit `2` blocks execution and records only non-secret reason codes. Exit `3` blocks execution as evidence failure. Authorization rejection is not auto-retried. An ambiguous downstream result after dispatch follows the reconciliation workflow rather than invoking this hook for a blind second execution.

## Blocks completion
Yes.