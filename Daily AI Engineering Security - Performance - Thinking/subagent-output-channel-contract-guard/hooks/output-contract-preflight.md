# Hook — Output Contract Preflight

## Trigger
Immediately before spawning a result-dependent subagent and again when validating its final envelope.

## Preconditions
Normalized contract JSON and policy JSON exist. Preflight also receives the child's advertised tool list; completion validation receives the result envelope.

## Action
Preflight:

`python scripts/output_contract_gate.py preflight contract.json --policy config/output-contract-policy.json --tools tools.json`

Completion:

`python scripts/output_contract_gate.py verify contract.json --policy config/output-contract-policy.json --result result.json`

## Expected result
Exit code 0 with `allow` at preflight and `verified` or `verified_empty` at completion.

## Failure behavior
Exit code 4 blocks dispatch/acceptance. Exit code 2 means malformed evidence and also blocks. Preserve partial results for diagnosis.

## Blocks completion
Yes. A bare or ambiguous empty child result never satisfies this hook by itself.
