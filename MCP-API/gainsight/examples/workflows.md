# Workflows

## Inspect Company schema
Tool: `gainsight.company.describe` (READ, no approval).
Input: `{"input":{"includeChildren":true}}`
Output: MCP text containing `{data,rate,untrustedProviderContent:true}`.

## Query companies
Tool: `gainsight.company.query` (READ, no approval).
Input: `{"input":{"select":["Name","Status"],"limit":100,"offset":0}}`.

## Create companies
Tool: `gainsight.company.create` (WRITE, approval required).
Input payload: `{"records":[{"Name":"Example customer"}]}`. The trusted host computes the approval HMAC for the exact parsed payload and supplies it as `approval`; the LLM must never receive `GAINSIGHT_APPROVAL_SECRET`.

## Relationship workflow
Use `gainsight.relationship.query` to inspect current records, prepare the intended record, obtain human approval, then call `gainsight.relationship.create`, `.update`, or `.upsert`. Writes are single-attempt and are not blindly retried.
