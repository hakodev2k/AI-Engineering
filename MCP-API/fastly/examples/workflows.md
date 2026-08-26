# Fastly MCP workflow examples

## Inspect before deploy

Tool: `fastly.service.list`  
Input: `{}`  
Permission: READ  
Approval: no  
Expected output: JSON array of services wrapped as `{ok:true,data:...,untrusted:true}`.

Tool: `fastly.version.validate`  
Input: `{"serviceId":"SERVICE_ID","version":12}`  
Permission: READ  
Approval: no  
Expected output: Fastly validation result.

Tool: `fastly.version.activate`  
Input: `{"serviceId":"SERVICE_ID","version":12,"approvalId":"<64-char approval digest>"}`  
Permission: HIGH_RISK  
Approval: required  
Expected output: activated version metadata.

## Cache incident response

Tool: `fastly.cache.purge_key`  
Input: `{"serviceId":"SERVICE_ID","surrogateKey":"article-123","soft":true,"approvalId":"<64-char approval digest>"}`  
Permission: HIGH_RISK  
Approval: required  
Expected output: Fastly purge acknowledgement.

Tool: `fastly.cache.purge_all`  
Input: `{"serviceId":"SERVICE_ID","approvalId":"<64-char approval digest>"}`  
Permission: DESTRUCTIVE  
Approval: required  
Expected output: Fastly purge-all acknowledgement. Use only when selective purge cannot solve the incident.
