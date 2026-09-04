# Hook — Pre-Exposure Boundary Check

## Trigger
Immediately before a normalized host value is exposed to untrusted/model-generated code, and in CI for recorded crossing fixtures.

## Preconditions
`config/boundary-policy.json` exists; the adapter can serialize a normalized observation without executing getters or arbitrary application code.

## Action
Validate the observation with the deterministic verifier before release/exposure.

## Script / command
```bash
python scripts/boundary_verifier.py observation.json --policy config/boundary-policy.json
```

## Expected result
Exit `0` with `status=pass` for data-only observations. Exit `2` with `status=blocked` for forbidden host markers, prototype/constructor surfaces, or other unsafe structures. Exit `3` for invalid input/policy.

## Failure behavior
Fail closed. Do not expose the value. Preserve the normalized observation and finding report, excluding real secrets. Route the finding to the sandbox/runtime owner.

## Blocks completion
Yes. A boundary validation failure blocks the code-execution feature from being reported Verified.

## Notes
This hook validates a normalized observation contract; production adapters must perform the normalization without dereferencing untrusted getters/proxies. For high-risk arbitrary code, use process/container isolation as a stronger boundary rather than relying solely on this hook.
