# Hook: Pre-Request Tool Schema Budget Gate

## Trigger
Before constructing each model request when the tool registry is large enough for lazy loading or has changed since the last measurement.

## Preconditions
Full tool registry and task text are available. `config/budget.json` is valid. Core tools are explicitly configured when required.

## Action
Run:

`python scripts/select_tool_schemas.py request-tools.json --config config/budget.json`

Use `compact_catalog` for discovery/routing and include full definitions only for `selected_tools`. Before a tool is invoked, ensure its full schema is present.

## Expected result
Exit `0` with either `decision=all` for below-threshold catalogs or `decision=lazy` with measured estimated savings and selected tools.

## Failure behavior
Exit `3` means the configured budget cannot fit required core tools and MUST block lazy-mode request construction; fall back to all-tools mode or raise the budget. Exit `2` means invalid input/config and MUST fail to the safe all-tools/static-toolset path rather than silently dropping tools.

## Blocking
Blocks optimized request construction, not the user task itself. A safe fallback that preserves required context is mandatory.