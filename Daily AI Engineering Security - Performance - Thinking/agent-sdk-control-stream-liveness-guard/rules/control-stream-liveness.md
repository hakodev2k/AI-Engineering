# Control-Stream Liveness Rules

- The host MUST measure a baseline before changing transport lifecycle logic.
- The control transport MUST NOT close while an active turn, outstanding control request, or background worker depends on it.
- Prompt iterable exhaustion MUST NOT be treated as proof that control-plane work is finished.
- Receipt of a top-level result MUST NOT terminate transport needed by still-active background work.
- Every tracked start/open event MUST have exactly one matching settle/end event before normal shutdown.
- Shutdown MUST have a bounded deadline and explicit cancellation path.
- State-changing tool retries MUST require idempotency or outcome reconciliation.
- Debug logging MUST NOT be considered a valid production workaround for a timing race.
- Performance improvements MUST include before/after latency and failure metrics.
- A regression test SHOULD exercise multi-tool, background-worker and cancellation paths.
