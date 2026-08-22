# Hook: Pre-Action Observability Gate

## Trigger
Immediately before a tool invocation that can cause side effects when the active task consumed observability or incident evidence.

## Preconditions
The host has serialized an action record containing `source_class`, `provenance`, and `action` fields and has loaded `config/policy.json`.

## Action
Run:

`python scripts/provenance_action_gate.py <record.json> --policy config/policy.json`

Interpret exit codes exactly:
- `0`: allow only the evaluated action.
- `4`: pause and obtain fresh exact approval or valid scoped remediation authorization.
- `5`: block the action.
- `2`: block completion because the gate input/configuration is invalid.

## Expected result
Every telemetry-derived high-impact action is either explicitly authorized or blocked before reaching the executor. Read-only actions may continue according to policy.

## Failure behavior
Fail closed. Do not bypass the hook, silently downgrade a capability, or retry with altered wording. If approval is obtained, regenerate the record with the approval bound to the exact action hash and run the hook again.

## Blocks completion
Yes for exit codes 2, 4, or 5 when the action is required for task completion. A task may instead complete as read-only investigation if the requested mutation is not authorized and the user-facing result clearly records that no mutation occurred.
