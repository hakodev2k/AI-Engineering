# Hook — Pre-Context Result Dedup Check

## Trigger
Immediately after an eligible read-only tool returns and before serializing its result into the next model request.

## Preconditions
Tool classification is known; result bytes are available; resource identity can be computed.

## Action
Run `python3 scripts/result_dedup_guard.py --ledger <ledger.json> --input <result.json>`. Append either the full payload or the compact unchanged-reference envelope according to the decision.

## Expected result
Exit 0 with a valid decision. `unchanged_reference` is allowed only when digest and freshness evidence match.

## Failure behavior
Any non-zero exit, malformed decision, unknown classification, or unavailable freshness evidence causes the runtime to emit the full result and log a non-secret diagnostic.

## Blocking
A hook failure blocks optimization but MUST NOT block the agent task. A detected false-dedup regression blocks release/rollout.