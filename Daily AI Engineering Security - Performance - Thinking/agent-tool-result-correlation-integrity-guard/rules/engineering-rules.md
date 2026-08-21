# Engineering Rules

## MUST

- Every tool invocation MUST have a composite identity containing session, generation, agent, and tool-call ID.
- Tool results MUST be matched to the exact composite invocation identity before model continuation.
- The host MUST reject orphaned results.
- Results from stale generations MUST be quarantined or explicitly reconciled before use.
- Conflicting duplicate results for the same invocation MUST fail closed.
- Identical duplicate results MAY be ignored only after deterministic payload comparison.
- Active unresolved tool calls MUST block continuation unless a documented policy explicitly permits partial continuation.
- Retry/fallback boundaries MUST create a new generation namespace.
- Side-effectful replay MUST have an idempotency proof or explicit human approval.
- Background executions from a retracted turn MUST be reconciled before replacement calls are dispatched.
- Correlation violations MUST produce deterministic reason codes and audit records.
- High-risk correlation recovery MUST be independently verified by an agent/operator other than the implementer.

## MUST NOT

- MUST NOT treat provider tool-call IDs as globally unique without session/generation scoping.
- MUST NOT bind a result by tool name, argument similarity, timestamp proximity, or list position alone.
- MUST NOT use "latest result wins" for conflicting duplicates.
- MUST NOT assume transcript rollback reverses real-world side effects.
- MUST NOT silently replay destructive or externally visible tools after timeout/retry.
- MUST NOT delete negative evidence such as dropped, orphaned, conflicting, or stale events.
- MUST NOT continue indefinitely while reconciliation fails; maximum retries are bounded by policy.
- MUST NOT ask the model to repair correlation state from hidden reasoning or memory.

## SHOULD

- Hosts SHOULD persist correlation state outside conversation text.
- Hosts SHOULD hash arguments and results for cheap replay/conflict detection.
- Hosts SHOULD use monotonic generation counters.
- Hosts SHOULD expose accepted/ignored/quarantined counts as telemetry.
- Hosts SHOULD attach trace IDs to subagent dispatches and tool executions.
- Hosts SHOULD preserve minimal metadata rather than raw sensitive payloads in audit logs.
- Hosts SHOULD baseline orphan, replay, and duplicate rates before rollout and compare after rollout.