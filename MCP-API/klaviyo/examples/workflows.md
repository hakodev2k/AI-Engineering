# Klaviyo connector examples

## Inspect profiles
Tool: `klaviyo.profile.list`  
Risk: READ  
Approval: no
```json
{"pageSize":20,"filter":"equals(email,\"person@example.com\")"}
```

## Inspect campaign
Tool: `klaviyo.campaign.get`  
Risk: READ  
Approval: no
```json
{"id":"campaign-id"}
```

## Create an event
Tool: `klaviyo.event.create`  
Risk: WRITE  
Approval: required
```json
{"metricName":"Placed Order","profile":{"email":"person@example.com"},"properties":{"order_id":"12345"},"value":49.99,"approval_token":"<payload-bound HMAC>"}
```
Provider responses are marked as untrusted data.
