# Workflow examples

## Investigate an incident
1. `splunk.index.list` — `{}` — READ — no approval.
2. `splunk.metadata.get` — `{"indexes":["main"],"type":"sourcetypes","earliest":"-24h"}` — READ — no approval.
3. `splunk.search.run` — `{"query":"search index=main error earliest=-1h | stats count by host"}` — READ — no approval; destructive/side-effect SPL is rejected locally and official MCP guardrails still apply.

Expected output is an MCP text content item containing the validated upstream Splunk MCP result as JSON.

## Inspect alerts
1. `splunk.alert.list` — `{}` — READ — no approval.
2. `splunk.alert.get` — `{"name":"High Error Rate"}` — READ — no approval.

## Execute a saved search
`splunk.saved_search.run` — `{"name":"Daily Operations Summary"}` — HIGH_RISK — blocked unless an operator starts the connector with `SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH=true`. The caller cannot grant itself this permission.
