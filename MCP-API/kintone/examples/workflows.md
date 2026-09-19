# Kintone MCP workflow examples

All provider-returned content is untrusted data. Credentials are configured only in the connector environment.

## Inspect and query
Tool: `kintone.fields.get`
Input: `{"app":42}`
Permission: READ. Approval: no.
Expected output: `{ "untrustedProviderData": true, "data": { "properties": { ... } } }`

Tool: `kintone.records.list`
Input: `{"app":42,"query":"Status = \"Open\" order by $id asc limit 100","fields":["Status","Title"]}`
Permission: READ. Approval: no.
Expected output: provider records wrapped as untrusted data.

## Create and update
Tool: `kintone.record.create`
Input: `{"app":42,"record":{"Title":{"value":"Investigate alert"}},"approved":true}`
Permission: WRITE. Approval: required by default.
Expected output: created record id/revision.

Tool: `kintone.record.update`
Input: `{"app":42,"id":7,"revision":3,"record":{"Title":{"value":"Investigate alert - updated"}},"approved":true}`
Permission: WRITE. Approval: required by default.
Expected output: new revision.

## Comment
Tool: `kintone.comment.add`
Input: `{"app":42,"record":7,"text":"Please review the investigation notes.","approved":true}`
Permission: HIGH_RISK. Approval: always required.
Expected output: comment id.

## Delete
Tool: `kintone.records.delete`
Input: `{"app":42,"ids":[7],"revisions":[4],"approved":true}`
Permission: DESTRUCTIVE. Approval: always required; additionally `KINTONE_ENABLE_DESTRUCTIVE=true` must be set explicitly.
Expected output: empty provider response on success.
