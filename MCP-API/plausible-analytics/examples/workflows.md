# Examples

## Read overview
Tool: `plausible.stats.overview`
Input: `{ "site_id": "example.com", "date_range": "30d" }`
Permission: READ. Approval: no.
Expected output: Plausible Stats API v2 JSON wrapped with HTTP status.

## Top pages
Tool: `plausible.stats.pages`
Input: `{ "site_id": "example.com", "date_range": "7d" }`
Permission: READ. Approval: no.

## Record custom event
Tool: `plausible.event.custom`
Input: `{ "domain":"example.com", "name":"Signup", "url":"https://example.com/signup", "user_agent":"Mozilla/5.0", "approved":true }`
Permission: WRITE. Approval: explicit human approval and `PLAUSIBLE_ALLOW_EVENT_WRITES=true`.
Expected output: HTTP 202 metadata and `dropped` flag when Plausible reports bot filtering.
