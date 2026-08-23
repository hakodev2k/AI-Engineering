# Rules — Model Stream Recovery Contract

- Every terminal turn MUST have exactly one normalized `terminal_final` event.
- Every terminal classification MUST preserve an observable causal `cause` and `actor`.
- A machine-generated timeout, stream stall, transport error or provider error MUST NOT be classified as `user_cancelled` unless an explicit actor=`user` cancellation event exists for that turn.
- Missing causal evidence MUST be classified as `unknown_failure`, not guessed.
- Explicit human cancellation MUST stop automated recovery for that turn.
- Recoverable failures SHOULD dispatch the configured recovery hook before final abandonment when the runtime supports such a hook.
- Hook invocation MUST NOT be treated as successful recovery unless its completion/result is recorded.
- Retry count MUST NOT exceed the configured budget.
- Retry/resume MUST NOT replay state-changing tool calls without a separate idempotency or side-effect reconciliation guarantee.
- Event sequence numbers MUST be strictly increasing and correlation identifiers MUST remain stable within one turn.
- A failed recovery hook MUST NOT be followed by `terminal_final: success` without later evidence of a successful independent recovery.
- Verification MUST use observable traces; hidden chain-of-thought MUST NOT be requested or stored.
