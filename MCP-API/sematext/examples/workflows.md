# Sematext MCP workflow examples

## Inspect synthetic health
Tool: `sematext.app.list`
Input: `{}`
Permission: READ
Approval: none
Output shape: Sematext API response containing visible Apps.

Tool: `sematext.synthetics.monitor.list`
Input: `{ "appId": 17174 }`
Permission: READ
Approval: none
Output shape: monitor collection for the Synthetics App.

Tool: `sematext.synthetics.monitor.run`
Input: `{ "appId": 17174, "approved": true, "runs": [{ "monitorId": 276, "regions": [1, 3] }] }`
Permission: WRITE
Approval: required by default
Output shape: Sematext run-trigger response.

## Investigate logs and events
Tool: `sematext.logs.search`
Input: `{ "appToken": "YOUR_LOGS_APP_TOKEN", "query": "level:ERROR", "size": 20 }`
Permission: READ
Approval: none
Output shape: Elasticsearch/OpenSearch-compatible search response.

Tool: `sematext.event.search`
Input: `{ "appToken": "YOUR_APP_TOKEN", "query": "eventType:deployment", "size": 20 }`
Permission: READ
Approval: none
Output shape: Elasticsearch/OpenSearch-compatible event search response.

Tool: `sematext.event.create`
Input: `{ "appToken": "YOUR_APP_TOKEN", "approved": true, "message": "release 2026.09.11 deployed", "eventType": "deployment", "tags": { "environment": "production" } }`
Permission: WRITE
Approval: required by default
Output shape: event-ingestion response.

Example tokens above are placeholders, never credentials.
