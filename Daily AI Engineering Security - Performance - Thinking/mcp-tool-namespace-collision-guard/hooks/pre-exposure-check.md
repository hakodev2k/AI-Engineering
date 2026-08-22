# Hook — Pre-exposure Check

## Trigger
Immediately before an MCP/tool registry is sent to an LLM or cached for later model use.

## Preconditions
A complete discovery manifest and `config/policy.json` are available.

## Action
Run:

`python scripts/mcp_namespace_guard.py <manifest.json> --policy config/policy.json`

## Expected result
Exit `0` and JSON containing `decision: allow`, a complete alias map, zero unresolved collisions, and a deterministic registry digest.

## Failure behavior
- Exit `2`: invalid manifest/policy; block exposure.
- Exit `3`: collision, drift, or ambiguity; block exposure and retain previous verified registry only if it still matches the active server set.

## Blocking
Failure blocks model exposure of the unverified registry. The hook MUST NOT downgrade collision failures to warnings for high-impact tools.