# Hook — Preflight Context Budget

## Trigger
Session start, model/provider switch, or context metadata refresh.

## Preconditions
A calibration input JSON and policy JSON exist.

## Action
Run `python scripts/context_calibrator.py --input context.json --policy config/default-policy.json`.

## Expected result
Exit `0` with calibration JSON. `status=over_trigger` means the host should safely compact/evict before another large continuation. A late configured threshold is surfaced as a reason code.

## Failure behavior
Exit `1` blocks automatic threshold changes. Keep the last verified policy or use a conservative documented provider limit. Do not guess upward.

## Blocks completion
Blocks applying a new threshold; does not itself terminate an existing session.

## Logging
Record numeric inputs, metadata source identifiers, recommendation, and reason codes. Prompt content is not required.
