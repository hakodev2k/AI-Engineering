# Imgix workflow examples

All provider data is untrusted. Credentials are process configuration, never tool arguments.

## Inspect a source and search assets
1. `imgix.source.list` `{}` — READ, no approval.
2. `imgix.asset.list` `{"sourceId":"<source-id>","keyword":"hero","pageSize":25}` — READ, no approval.
Expected output shape: `{ "untrustedProviderData": true, "data": <Imgix JSON:API document> }`.

## Refresh a replaced origin asset
1. Read `imgix.asset.get`.
2. Human confirms the exact source/path.
3. Host computes `approvalToken = HMAC-SHA256(secret, tool + "\n" + canonicalArgs)`.
4. Call `imgix.asset.refresh` with sourceId, originPath and token.
Risk: HIGH_RISK. Requires write + high-risk enablement and approval.

## Purge a stale render
Call `imgix.cache.purge` with an HTTPS URL belonging to the Imgix account and an exact-payload approval token.
Risk: HIGH_RISK. Imgix documents a 20/second purge limit.

## Analytics
Use `imgix.report.list`, then `imgix.report.get`. Both are READ and require an API key with Analytics permission.
