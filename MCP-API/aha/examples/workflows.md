# Aha! MCP workflow examples

All provider responses are untrusted data. READ tools need no approval. WRITE tools require `AHA_WRITE_APPROVED=true` for the approved execution window.

## Inspect roadmap work

Tool: `aha.workspace.list`
Input: `{ "page": 1, "perPage": 30 }`
Permission: READ
Approval: No
Expected output: Aha! JSON containing `products` and pagination metadata.

Tool: `aha.release.list`
Input: `{ "productId": "PRJ1", "excludeShipped": true }`
Permission: READ
Approval: No
Expected output: Aha! JSON containing releases for the workspace.

Tool: `aha.feature.list`
Input: `{ "query": "checkout", "workflowStatus": "New", "perPage": 50 }`
Permission: READ
Approval: No
Expected output: matching features plus pagination metadata.

## Create and refine a feature

Tool: `aha.feature.create`
Input: `{ "releaseId": "PRJ1-R-1", "name": "Improve checkout recovery", "description": "<p>Preserve cart state after payment retry.</p>", "disableMailers": true }`
Permission: WRITE
Approval: Required
Expected output: the created feature record.

Tool: `aha.feature.comment.create`
Input: `{ "featureId": "PRJ1-42", "body": "<p>Reviewed with engineering; API dependency confirmed.</p>" }`
Permission: WRITE
Approval: Required
Expected output: the created comment.

## Explore ideas

Tool: `aha.idea.list`
Input: `{ "query": "mobile onboarding", "sort": "popular", "perPage": 25 }`
Permission: READ
Approval: No
Expected output: matching ideas and pagination metadata.

Tool: `aha.idea.update`
Input: `{ "ideaId": "PRJ1-I-15", "workflowStatus": "Planned" }`
Permission: WRITE
Approval: Required
Expected output: the updated idea.
