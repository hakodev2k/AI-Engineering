# Workflow examples

The concrete upstream tool names depend on the actions explicitly enabled on your Zapier MCP server. The connector exposes only names in `ZAPIER_MCP_ALLOWED_TOOLS`, prefixed with `zapier.`.

## Read/search

Tool: `zapier.<enabled-search-tool>`

Input: `{ "arguments": { "query": "Acme" } }`

Permission: READ. Approval: no.

Expected output: JSON containing `source: "untrusted_provider_data"`, risk, and the upstream MCP result.

## Write

Tool: `zapier.<enabled-write-tool>`

Input: `{ "arguments": { "...": "provider-specific values" }, "approval_token": "<HMAC bound to exact tool+arguments>" }`

Permission: WRITE. Approval: yes. Generate the approval token outside the model after a human reviews the exact arguments.

Destructive actions are rejected even if Zapier exposes and allowlists them.
