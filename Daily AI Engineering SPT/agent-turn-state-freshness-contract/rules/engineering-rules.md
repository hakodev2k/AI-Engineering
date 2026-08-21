# Engineering Rules

## MUST
- MUST create a unique `turn_id` before processing mutable work for each new user turn.
- MUST distinguish conversation-scoped state from turn-scoped working, evidence, and terminal state.
- MUST attach `owner_turn_id` to every turn-scoped terminal field.
- MUST invalidate configured terminal fields at new-turn admission before model/tool execution.
- MUST require `owner_turn_id == active_turn_id` before a terminal field can drive routing or finalization.
- MUST reject current-turn finalization when any required evidence is owned by a different turn unless an explicit reusable-evidence policy exists.
- MUST rebuild retries from the latest durable state revision after completed in-flight tool writes are reconciled.
- MUST correlate replay/live events with `run_id`, `turn_id`, or an equivalent durable boundary before treating them as current evidence.
- MUST fail closed when ownership metadata required by policy is missing.
- MUST keep retries bounded to the configured refresh/retry limits.
- MUST record stale-state violations as metadata: thread, active turn, foreign owner, field, revision, action taken.
- MUST preserve legitimate conversation memory while resetting turn-scoped terminal state.

## MUST NOT
- MUST NOT use mere key presence such as `"structured_response" in state` as a finalization predicate across persisted turns.
- MUST NOT let a previous turn's `final_response`, `structured_response`, `completion_status`, decision, verification result, or approval silently satisfy the current turn.
- MUST NOT reuse a prompt/state snapshot captured before a retry loop when newer durable writes may have occurred.
- MUST NOT classify an uncorrelated replayed event as evidence for the active run.
- MUST NOT solve the problem by deleting all memory or disabling checkpointing without a measured reason.
- MUST NOT ask the model to infer whether state is stale when deterministic ownership metadata can decide it.
- MUST NOT hide a freshness failure by returning the most recent available terminal value.
- MUST NOT retry indefinitely after state corruption or identity ambiguity.

## SHOULD
- SHOULD use monotonic state revision numbers in addition to turn IDs.
- SHOULD make terminal-state wrappers schema-validated and immutable after publication.
- SHOULD centralize freshness checks in middleware/hooks rather than duplicate ad-hoc checks in every node.
- SHOULD expose freshness metrics: blocked stale finalizations, stale-field rate, retry refreshes, orphan outputs, and foreign-run events.
- SHOULD include adversarial two-turn and interrupted-stream tests in CI.
- SHOULD retain historical terminal values only as explicitly non-authoritative audit history.
- SHOULD require an independent verifier for changes to turn-routing/finalization semantics in high-impact agents.
