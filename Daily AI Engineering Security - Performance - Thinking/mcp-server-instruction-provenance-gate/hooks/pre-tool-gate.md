# Hook — Pre-Tool MCP Instruction Gate

## Trigger
Immediately before executing any tool whose plan, arguments, or selection was influenced by MCP server instructions.

## Preconditions
The caller has the server ID, exact current instruction text, requested capabilities, and `config/policy.json`.

## Action
Serialize the decision input to a local JSON file and run the deterministic gate.

## Script / command
`python3 scripts/instruction_gate.py <input.json> --policy config/policy.json`

## Expected result
- Exit 0: action may continue within the declared capability.
- Exit 4: explicit current-content approval is required.
- Exit 5: action is denied.
- Exit 2: input/policy is invalid and high-impact execution must not continue.

## Failure behavior
On nonzero exit, stop the pending tool action and preserve the bounded decision output for audit. Do not retry automatically unless the inputs materially change.

## Blocks completion
Yes for any high-impact action. A task cannot be marked verified while a required gate is failing or bypassed.
