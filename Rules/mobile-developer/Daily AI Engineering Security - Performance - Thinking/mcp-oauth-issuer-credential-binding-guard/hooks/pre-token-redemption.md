# Hook: Pre Token Redemption Binding Check

## Trigger
Immediately before exchanging an authorization code or using a stored refresh token.

## Preconditions
The authorization transaction record contains expected issuer and protected resource. Inputs are metadata only; secrets are never passed to the hook.

## Action
Build a redacted JSON envelope containing expected/observed issuer, expected/observed resource or audience, callback age, credential provenance, and issuer-change flag. Run the validator.

## Script/command
`python scripts/validate_oauth_binding.py binding-envelope.json --policy config/policy.json`

## Expected result
Exit `0` with decision `allow` only when issuer/resource binding is consistent. Exit `4` requests reauthorization for stale/legacy provenance. Exit `5` blocks a mismatch. Exit `2` indicates invalid evidence.

## Failure behavior
Do not redeem the authorization code, refresh the token, or execute a protected tool. Preserve only redacted evidence. Reauthorization is allowed only when the policy decision explicitly permits it.

## Blocking
Yes. Any non-zero exit blocks token redemption/use for the current transaction.