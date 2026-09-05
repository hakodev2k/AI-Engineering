# Hook: Pre-Delegation Secret Policy

## Trigger
Before enabling/deploying delegated-agent configuration.

## Preconditions
Policy JSON describes inheritance, requested/allowed names, sensitive additions, delivery modes.

## Action
Run deterministic checker on names only.

## Script / command
`python scripts/check_delegation_env.py <policy.json>`

## Expected result
Exit 0 PASS.

## Failure behavior
Exit 2 blocks policy violations; exit 1 blocks unverifiable configuration. Persist names/findings only.

## Blocks completion
Yes. Do not bypass with wildcard allowlists or removed sensitivity labels.