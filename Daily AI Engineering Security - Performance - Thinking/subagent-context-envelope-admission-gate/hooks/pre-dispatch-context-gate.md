# Hook: Pre-Dispatch Context Gate

## Trigger
Immediately before a subagent request is serialized or sent to a model provider.

## Preconditions
The orchestrator has produced a JSON envelope measurement and `config/context-policy.json` is readable.

## Action
Run:

```bash
python3 scripts/context_fit_gate.py <envelope.json> --policy config/context-policy.json
```

Interpret exit codes:
- `0`: allow dispatch.
- `3`: reduce optional context and remeasure.
- `4`: reroute to an explicitly approved model and remeasure.
- `5`: block dispatch.
- `2`: invalid measurement/configuration; block dispatch.

## Expected result
A JSON decision containing the effective budget, total input, required input, utilization, headroom/deficit, and remediation reason.

## Failure behavior
Any invalid input, unknown required model limit under fail-closed policy, or required-only overflow blocks completion. The hook MUST NOT silently bypass itself.

## Blocking
Yes. A non-zero result MUST block the current dispatch until a bounded remediation workflow produces a fresh `allow` result.
