# Brevo connector examples

## Inspect contacts
Tool: `brevo.contact.list` — READ — approval: no
```json
{"limit":50,"offset":0,"sort":"desc"}
```

## Create a contact
Tool: `brevo.contact.create` — WRITE — approval: required
```json
{"email":"person@example.com","attributes":{"FNAME":"Alex"},"listIds":[12],"approval_token":"<payload-bound-hmac>"}
```

## Prepare a draft campaign
Tool: `brevo.campaign.create` — WRITE — approval: required
```json
{"name":"Launch","sender":{"email":"news@example.com","name":"News"},"subject":"Launch","htmlContent":"<p>Hello</p>","recipients":{"listIds":[12]},"approval_token":"<payload-bound-hmac>"}
```

## Send a campaign
Tool: `brevo.campaign.send` — HIGH_RISK — approval: required
```json
{"campaignId":42,"approval_token":"<payload-bound-hmac>"}
```

## Send a transactional email
Tool: `brevo.transactional_email.send` — HIGH_RISK — approval: required
```json
{"to":[{"email":"person@example.com"}],"sender":{"email":"service@example.com","name":"Service"},"subject":"Receipt","textContent":"Your receipt is ready.","approval_token":"<payload-bound-hmac>"}
```

## Create a webhook
Tool: `brevo.webhook.create` — HIGH_RISK — approval: required
```json
{"url":"https://hooks.example.com/brevo","events":["delivered","hardBounce"],"type":"transactional","approval_token":"<payload-bound-hmac>"}
```
