# Hook: Pre-Privileged Actor Attestation

## Trigger
Immediately before a spawned/resumed/forked/nested actor receives privileged tools, network, write access, secrets, or deployment capability.

## Preconditions
Declared and observed JSON snapshots exist; actor/lifecycle metadata is known; protected paths are configured.

## Action
Run the deterministic attestor against the post-transition runtime snapshot.

## Script/command
`python3 scripts/attest_config.py "$EXPECTED_JSON" "$OBSERVED_JSON" --actor "$ACTOR_ID" --lifecycle "$LIFECYCLE" --protected sandbox.enabled --protected permissions.deny`

## Expected result
Exit `0` and JSON status `pass`.

## Failure behavior
Exit `2`: block privileged capability and record mismatches. Exit `1`: block because evidence is invalid/incomplete. Refresh snapshot once only for a known race.

## Blocks completion
Yes. Privileged work cannot be marked ready while attestation is absent, invalid, or mismatched.