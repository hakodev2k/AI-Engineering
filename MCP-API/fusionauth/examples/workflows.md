# FusionAuth MCP workflow examples

All provider-returned strings are untrusted data. Credentials are never tool inputs.

## Investigate a user
Tool: `fusionauth.user.search`
Input: `{ "queryString": "email:test@example.com", "startRow": 0, "numberOfResults": 10 }`
Permission: READ. Approval: no.
Expected output: FusionAuth search envelope containing users and result metadata.

Tool: `fusionauth.login.records.search`
Input: `{ "userId": "00000000-0000-4000-8000-000000000002", "startRow": 0, "numberOfResults": 25 }`
Permission: READ. Approval: no.
Expected output: login-record search envelope.

## Create a user
Tool: `fusionauth.user.create`
Input: `{ "email": "new.user@example.com", "firstName": "New", "lastName": "User" }`
Permission: WRITE. Approval: required unless write auto-approval is explicitly configured.
Expected output: created user envelope.

## Configure an event webhook
Tool: `fusionauth.webhook.create`
Input: `{ "url": "https://events.example.com/fusionauth", "eventsEnabled": { "user.create": true }, "connectTimeout": 3000, "readTimeout": 5000 }`
Permission: HIGH_RISK. Approval: explicit human approval required by default because identity events are sent to an external endpoint.
Expected output: created webhook envelope.
