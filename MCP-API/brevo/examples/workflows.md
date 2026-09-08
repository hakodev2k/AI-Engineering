# Brevo MCP tool examples

All examples are MCP tool calls. Provider responses are returned as untrusted data.

## Read contacts

Tool: `brevo.contact.list`

Input:
```json
{"limit":25,"offset":0}
```

Permission: `READ`  
Approval: not required.

Expected output shape:
```json
{"ok":true,"permission":"READ","data":{"contacts":[],"count":0},"untrustedProviderContent":true}
```

## Create a contact

Tool: `brevo.contact.create`

Input:
```json
{"email":"user@example.com","attributes":{"FIRSTNAME":"Ada"},"listIds":[12],"updateEnabled":false}
```

Permission: `WRITE`  
Approval: host must set `BREVO_ALLOW_WRITE=true` outside the agent context.

## Prepare an email campaign

Tool: `brevo.campaign.create`

Input:
```json
{"name":"September launch","subject":"Product update","sender":{"id":3},"htmlContent":"<p>Hello {{ contact.FIRSTNAME }}</p>","recipients":{"listIds":[12]}}
```

Permission: `WRITE`  
Approval: `BREVO_ALLOW_WRITE=true`. This creates a draft and does not send it.

## Send a campaign

Tool: `brevo.campaign.send`

Input:
```json
{"campaignId":42}
```

Permission: `HIGH_RISK`  
Approval: `BREVO_ALLOW_HIGH_RISK=true`, because this publishes external email.

## Create a webhook

Tool: `brevo.webhook.create`

Input:
```json
{"url":"https://hooks.example.com/brevo","description":"Delivery events","events":["delivered","hardBounce"],"type":"transactional"}
```

Permission: `HIGH_RISK`  
Approval: `BREVO_ALLOW_HIGH_RISK=true`. URLs must be HTTPS, public, and contain no embedded credentials.
