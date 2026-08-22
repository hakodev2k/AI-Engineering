# Verification Report

## Status model
This package distinguishes **Implemented**, **Measured**, and **Verified**. A design or test file existing is not by itself a claim that a target production runtime is fixed.

## Implemented
The package implements:

- explicit `turn_id` / `active_turn_id` ownership;
- configurable turn-scoped terminal/evidence fields;
- new-turn terminal invalidation;
- deterministic freshness validation;
- owner stamping helper;
- fail-closed behavior for stale/missing ownership;
- bounded refresh/retry policy;
- hooks for turn admission, tool evidence, finalization, retry refresh, event correlation, and CI;
- adversarial unit tests for stale/unowned terminal state, foreign evidence, missing turn identity, and memory-preserving turn initialization.

## Measured
The package defines these measurable gates for a target integration:

| Metric | Required gate |
|---|---:|
| stale final responses per 1,000 regression turns | 0 |
| stale structured-response early exits | 0 |
| authoritative terminal fields without owner metadata | 0 |
| finalizations using foreign-turn evidence | 0 |
| retries based on a revision older than completed current-turn evidence | 0 |
| automatic state refreshes per failed finalization | <= 1 |
| execution retries after refresh | <= 1 |

Production values must be collected by the integrating runtime; this package does not invent them.

## Verified package-level properties
Static review of generated artifacts verifies that:

1. every configured terminal field is covered by `validate_state`;
2. terminal state without an owner is rejected when `require_owner_turn_id=true`;
3. terminal state with a foreign owner is rejected;
4. evidence collections are validated item-by-item;
5. `init_turn` changes active turn identity and invalidates terminal fields while copying unrelated memory/state;
6. the helper uses bounded deterministic logic and no network, secrets, or destructive operations;
7. tests target the reported failure class rather than generic correctness only;
8. retry/workflow documentation never recommends returning stale state as fallback.

## Runtime verification commands
From the package directory:

```bash
python -m unittest tests/test_turn_state_guard.py -v
```

Expected: all tests pass.

Manual stale-state check:

```bash
python scripts/turn_state_guard.py validate-state \
  --state examples/state-examples.json \
  --policy config/turn-state-policy.json
```

`examples/state-examples.json` contains multiple named examples rather than one direct state object, so adapters should extract either `stale_input_example` or `fresh_finalization_example` into a standalone file before calling the validator.

## Target-runtime fault injection
A production integration is **Verified** only after these scenarios pass:

1. turn 1 writes a valid structured/final response; turn 2 begins and the old value is injected/restored; turn 2 must not finalize from it;
2. turn 2 produces a current tool result, then stream transport is interrupted before normal completion; retry must load the persisted current tool result;
3. a finalizer receives mixed turn-1 and turn-2 evidence; it must reject the foreign item or use a separately approved reusable-evidence policy;
4. a hydrated event stream replays historical completion events before live events; historical events must not settle the current submit;
5. `owner_turn_id` is removed from a terminal field; finalization must fail closed;
6. state refresh itself fails; the system must stop after the configured bound rather than reuse stale cached state.

## Safety checks
- No hidden chain-of-thought is requested or stored.
- Conversation memory is not globally cleared.
- The validator logs ownership metadata, not raw potentially sensitive payloads.
- Failure handling preserves correctness instead of weakening checks.
- No dangerous or irreversible action is introduced.

## Definition of Done for an integration
- evidence and baseline documented;
- ownership matrix complete;
- new-turn admission creates unique turn identity;
- terminal fields are invalidated/versioned;
- every route-to-END/final response passes freshness validation;
- retry reconstructs from latest durable state;
- replay/live events are correlated;
- unit and fault-injection tests pass;
- required metrics collected;
- independent verifier signs off for high-impact agents;
- no blocking freshness violation remains.
