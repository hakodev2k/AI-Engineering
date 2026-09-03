# Heroku connector workflows

## Inspect an application
1. `heroku.app.list` — `{ "all": true }` — READ, no approval.
2. `heroku.app.get` — `{ "app": "example-app" }` — READ, no approval.
3. `heroku.dyno.list` — `{ "app": "example-app" }` — READ, no approval.
4. `heroku.release.list` — `{ "app": "example-app" }` — READ, no approval.

## Diagnose an incident
1. `heroku.logs.get` — `{ "app": "example-app", "processType": "web", "source": "heroku" }` — READ, no approval.
2. `heroku.rate_limit.get` — `{}` — READ, no approval.
3. `heroku.dyno.restart` — `{ "app": "example-app", "processType": "web" }` — HIGH_RISK, exact human-approved action fingerprint required.

## Change runtime configuration
Tool: `heroku.config.update`
Input: `{ "app": "example-app", "changes": { "FEATURE_X": "enabled", "OLD_SETTING": null } }`
Permission: HIGH_RISK.
Approval: exact `heroku.config.update:example-app:FEATURE_X+OLD_SETTING` fingerprint is required.
Expected output: updated key names and resulting key names; config values are never echoed.
