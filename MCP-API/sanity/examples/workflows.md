# Sanity connector workflows

## Query content
Tool: `sanity.content.query`  
Permission: READ  
Approval: no

```json
{"query":"*[_type == $type][0...10]{_id,title}","params":{"type":"post"},"perspective":"published"}
```

## Create drafts
Tool: `sanity.document.create_draft`  
Permission: WRITE  
Approval: required

```json
{"documents":[{"_type":"post","title":"Prepared by an agent"}],"approval_token":"<payload-bound HMAC>"}
```

## Publish content
Tool: `sanity.document.publish`  
Permission: HIGH_RISK  
Approval: required

```json
{"documentIds":["drafts.post-123"],"approval_token":"<payload-bound HMAC>"}
```

## Discard a draft
Tool: `sanity.document.discard_draft`  
Permission: DESTRUCTIVE  
Approval: required  
Additional gate: `SANITY_ENABLE_DESTRUCTIVE=true`
