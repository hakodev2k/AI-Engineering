# Hook — Pre OAuth Transition

## Trigger
Immediately before opening an authorization URL and immediately before processing an OAuth callback/token exchange.

## Preconditions
A transaction record exists, policy is loaded, and the host can distinguish `authorize` from `callback` phase.

## Action
Serialize only non-secret transaction metadata to a temporary JSON record and invoke `scripts/oauth_transaction_guard.py` with the matching phase.

## Command
```bash
python scripts/oauth_transaction_guard.py transaction.json --policy config/policy.json --phase authorize
python scripts/oauth_transaction_guard.py transaction.json --policy config/policy.json --phase callback
```

## Expected result
Exit `0` with decision `allow`. Output contains a transaction fingerprint and reason list but no code/token/cookie/PKCE verifier.

## Failure behavior
Exit `2`: configuration/input defect; block transition. Exit `5`: security denial; block transition and log only sanitized reason codes. Never fall back to an unvalidated OAuth path.

## Blocking
Yes. Failure blocks browser launch, callback exchange, or downstream authorization-code issuance for the affected transaction.
