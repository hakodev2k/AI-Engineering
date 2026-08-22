# Hook: Pre-Tool Instruction Check

## Trigger
Immediately before any high-impact tool call influenced by MCP-provided natural language.

## Preconditions
An input JSON exists with server identity, current instruction text, prior hash, requested capabilities, and approval state.

## Action
Run:

`python scripts/instruction_gate.py <input.json> --policy config/policy.json`

## Expected result
Exit `0` permits the policy layer to continue. Exit `4` blocks execution pending explicit action-bound approval. Exit `5` denies the action. Exit `2` is a configuration/input failure and blocks high-impact execution.

## Failure behavior
Do not execute the tool. Persist the validator output, preserve user data, and request review/approval only when the result is `approval_required`.

## Blocking
Yes. This hook is mandatory for configured high-impact capabilities and MUST NOT be bypassed by model-generated prose.