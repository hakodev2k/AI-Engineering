# Hook: Pre-Release Authorization Parity Gate

## Trigger
Before releasing a change that adds or modifies any shared/template agent mutation capability.

## Preconditions
`config/mutation-paths.json` reflects all current mutation paths and security tests run in an isolated environment.

## Action
Run:

```bash
python scripts/policy_parity_check.py config/mutation-paths.json --output parity-report.json
python -m unittest tests/test_policy_parity_check.py
```

Then run product-specific negative tests for every inventoried protected mutation path with a scoped/session-only caller.

## Expected result
Parity checker and unit tests exit 0; all unauthorized mutations are denied; authorized administrative mutation remains functional; denied attempts are audited without secrets.

## Failure behavior
Block release. Preserve the failing path/control evidence and remediate the authorization boundary. Do not widen the caller's permissions or disable audit/security controls to obtain a pass.

## Blocking
Yes.
