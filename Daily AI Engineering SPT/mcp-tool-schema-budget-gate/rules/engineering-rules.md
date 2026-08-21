# Engineering Rules

## MUST
- MUST measure the current tool-schema footprint before optimization.
- MUST keep a versioned budget policy and machine-readable report.
- MUST classify exposed tools as `hot`, `deferred`, or `disabled` using task evidence.
- MUST preserve required schema constraints, authorization boundaries, destructive-action approvals, and secret handling even when they increase token cost.
- MUST validate both token reduction and tool-selection capability before rollout.
- MUST fail closed when required tools disappear or the configured budget is exceeded in CI.
- MUST rerun the gate after MCP server, client, provider, model, tokenizer, or schema changes.
- MUST record whether token counts are exact or estimates.

## MUST NOT
- MUST NOT remove descriptions, parameter constraints, enums, validation rules, or safety annotations solely to hit a token target without correctness tests.
- MUST NOT treat prompt-cache hits as proof that context-window pressure is solved.
- MUST NOT silently disable tools used by production workflows.
- MUST NOT use an unlimited retry loop when Tool Search or discovery fails.
- MUST NOT include credentials, OAuth tokens, tool arguments containing user data, or secrets in benchmark fixtures.
- MUST NOT claim savings from estimated counts as provider-exact measurements.

## SHOULD
- SHOULD keep the always-hot set small and task-oriented.
- SHOULD prefer deferred loading or server/toolset partitioning over destructive schema minification.
- SHOULD run a fixed smoke suite for critical servers after client upgrades.
- SHOULD alert when any single tool exceeds `warn_tool_tokens` even if the total still passes.
- SHOULD compare against the last known-good baseline and require an explanation for material growth.
- SHOULD separate registration-time metadata from runtime tool arguments in telemetry.

## Default thresholds
The sample config is intentionally conservative, not universal. Tune thresholds from measured workloads and model limits. A policy change is a reviewed engineering change, not an automatic response to a failing gate.