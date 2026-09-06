# Token Semantics Rules

## Scope
These rules govern context occupancy, compaction, routing, and token telemetry whenever a provider can return multi-iteration usage.

## Rules
- Token metrics **MUST** be labeled by semantic role: current occupancy, cumulative executor processing, advisor/sub-inference processing, cached input, output, or estimate.
- A compaction controller **MUST NOT** use a cumulative top-level input total as current context occupancy when per-iteration executor usage is available.
- Current occupancy **MUST** be derived from the final relevant executor/message iteration's `input_tokens + cache_read_input_tokens + cache_creation_input_tokens`, unless the provider documents a more precise occupancy field.
- Advisor/sub-inference iterations **MUST NOT** be added to executor context occupancy.
- Cumulative usage **MAY** be used for cost/throughput accounting, but **MUST** remain distinct from occupancy.
- When iteration data is absent, fallback logic **MUST** mark occupancy as `fallback` or `estimated`; it **MUST NOT** silently claim exactness.
- A compaction decision **MUST** include the model's effective context window and an explicit reserved-output/safety budget.
- Controllers **MUST** emit the occupancy source and compaction threshold in telemetry.
- An inflation ratio above the configured guard threshold **MUST** produce a diagnostic event before compaction.
- Main-agent and subagent paths **MUST** use the same semantic normalization contract.
- Token optimization **MUST NOT** remove correctness-critical context merely to make telemetry conform.
- Regression tests **MUST** include at least one multi-iteration Advisor example and one ordinary single-iteration example.
- A new provider usage shape **MUST** fail to an explicit compatibility state until mapped; unknown fields **MUST NOT** be guessed into occupancy.

## Recommended thresholds
Implementations **SHOULD** alert when cumulative-to-occupancy inflation exceeds `1.25x`, and **SHOULD** block automatic compaction driven solely by a cumulative value when the normalized occupancy remains below the configured threshold.
