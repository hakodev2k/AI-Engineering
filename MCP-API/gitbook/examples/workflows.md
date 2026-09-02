# GitBook connector workflows

## Audit documentation links
Tool: `gitbook.space.links.list`
Input: `{ "spaceId": "SPACE_ID", "limit": 100 }`
Permission: READ. Approval: no.
Expected output: JSON array of link-status records returned by GitBook.

## Draft and review a documentation change
1. `gitbook.change_request.create` with `{ "spaceId": "SPACE_ID", "subject": "Document new API behavior" }` — WRITE; approval depends on connector policy.
2. `gitbook.change_request.get` — READ; no approval.
3. `gitbook.change_request.merge` — HIGH_RISK; always requires the exact action fingerprint in `GITBOOK_APPROVED_ACTIONS`.

## Ask published docs
Tool: `gitbook.site.ask`
Input: `{ "organizationId": "ORG_ID", "siteId": "SITE_ID", "question": "How is authentication configured?", "format": "markdown" }`
Permission: READ. Approval: no.
Expected output: provider-grounded response from the GitBook Site AI Ask API.
