# Hook — Pre-Compaction Telemetry Check

## Trigger
Immediately before automatic or manual context compaction, model routing, or a context-pressure alert uses token telemetry.

## Preconditions
A canonical event exists with `current_context_tokens`, `model_context_window`, `measurement_source`, and `session_cumulative_tokens` when available.

## Action
Validate the event and surrounding sequence with the deterministic telemetry guard.

## Script / command
`python3 scripts/token_telemetry_guard.py <events.jsonl> --policy config/policy.json --strict`

## Expected result
Exit 0 means telemetry is safe for the configured automation. Exit 3 means a semantic/provenance/bounds violation blocks the decision. Exit 2 means invalid input/configuration.

## Failure behavior
Do not compact or route based on an ambiguous counter. Preserve the raw event, surface the violation, and fall back to a documented provider-measured current-context field or human diagnosis.

## Blocks completion
Yes when the affected counter drives automated context management.
