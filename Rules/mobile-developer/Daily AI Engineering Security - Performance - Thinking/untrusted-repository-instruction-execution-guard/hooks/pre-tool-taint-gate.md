# Hook: Pre-Tool Taint Gate

## Trigger
Immediately before a high-impact tool executes or before an auto-approval decision is finalized.

## Preconditions
The caller supplies a JSON decision document containing context `sources`, `tool`, `environment`, and `approval`. `config/trust-policy.json` must be available.

## Action
Run the deterministic taint gate before tool execution. The hook must execute outside the model's discretionary reasoning path so a model cannot override its result.

## Script/command
`python scripts/taint_gate.py decision.json --policy config/trust-policy.json`

## Expected result
- Exit `0`: allow.
- Exit `4`: explicit human approval is required; do not execute yet.
- Exit `5`: deny; do not execute.
- Exit `2`: invalid/missing policy or input; fail closed for high-impact execution.

## Failure behavior
Any non-zero result blocks immediate execution. Invalid-input failures must be treated as `require_approval` or stricter by the integrating runtime, never as allow. Preserve a redacted decision/audit record.

## Blocks completion
Yes for any high-impact tool call that has not received an `allow` decision after required approval.
