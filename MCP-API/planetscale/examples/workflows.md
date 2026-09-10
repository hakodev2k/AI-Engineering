# PlanetScale connector examples

## Inspect schema
Tool: `planetscale.branch.schema`
Input: `{"organization":"acme","database":"app","branch":"main"}`
Permission: READ. Approval: no.
Expected output: `{ "untrustedProviderData": true, "result": <official MCP result> }`.

## Diagnose query performance
Call `planetscale.insights.get`, then `planetscale.query_tag.summary`, then `planetscale.schema_recommendation.list`. All are READ and require no approval.

## Read data
Tool: `planetscale.query.read`
Input: `{"organization":"acme","database":"app","branch":"main","query":"SELECT count(*) FROM users","use_replica":true}`
Permission: READ. Approval: no. PlanetScale routes reads to a replica when available.

## Write data
Tool: `planetscale.query.write`
Input includes organization/database/branch, an exact SQL statement, and an externally generated `approvalToken` bound to that exact payload.
Permission: HIGH_RISK. Approval: always; `PLANETSCALE_ENABLE_WRITE=true` must also be set by the operator.
Writes are attempted once and are never automatically retried.
