# Workflows

## Investigate recent logs
Tool: `logz-io.log.search` — READ, no approval.
```json
{"query":{"query":{"match":{"service":"checkout"}}},"from":0,"size":50}
```
Expected shape: `{ "provider":"Logz.io", "untrustedProviderData":true, "status":200, "data":{...} }`.

## Inspect alert state
Call `logz-io.alert.list`, then `logz-io.alert.get`, then `logz-io.alert.triggered.list`. All are READ and require no connector approval.

## Create an alert
`logz-io.alert.create` is HIGH_RISK because an enabled alert can notify external recipients. A trusted approval service must calculate `approvalToken` from the exact final payload and connector approval secret. The agent must never receive that secret.

## Delete an alert
`logz-io.alert.delete` is DESTRUCTIVE. The operator must set `LOGZ_IO_ENABLE_DESTRUCTIVE=true`, supply a payload-bound approval token, and repeat the target in `confirmAlertId`.

## Dashboard discovery
Call `logz-io.dashboard.list`, then `logz-io.dashboard.folder.get` or `logz-io.dashboard.folder.list_dashboards`. These are READ operations.
