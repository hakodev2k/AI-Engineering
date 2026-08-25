# Hook: Pre-Credential Helper Provenance

## Trigger
Immediately before an agent action that would invoke a configured local credential helper.

## Preconditions
Trusted policy exists; Python 3.10+ is available.

## Action
Validate helper absolute path, realpath, executability, optional SHA-256, and PATH shadowing without executing the helper.

## Script/command
`python3 scripts/helper_provenance.py --config <trusted-policy.json>`

## Expected result
Exit 0 and every helper reports `status: verified`.

## Failure behavior
Exit 2 blocks the credential-bearing action. Exit 1 blocks completion because policy/input is invalid.

## Blocks completion
Yes.