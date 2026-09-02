# Hook: Post Config Change

## Trigger

Immediately after repository edits that add, remove, rename, or constrain environment variables.

## Preconditions

The contract and sample files have been updated to match the intended change.

## Action

For each affected environment run:

```bash
python scripts/check_env_contract.py --contract config/env-contract.json --env-file <sample-file> --environment <environment> --output <evidence-json>
```

Then run targeted tests/build for the configuration consumer.

## Expected result

Validator exit code `0`, no undocumented variables, no unsafe sample secret, and passing targeted verification.

## Failure behavior

Block completion. Preserve validator JSON and test output. Permit at most 2 repair cycles.

## Blocking

Yes.