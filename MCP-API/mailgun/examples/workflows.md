# Example workflows

## Delivery investigation

Tool: `mailgun.event.list`

Input:
```json
{"domain":"mg.example.com","event":"failed","limit":100,"severity":"permanent"}
```
Permission: READ. Approval: no.

Expected shape: Mailgun event response with `items` and `paging` fields.

## Approved transactional send

Tool: `mailgun.message.send`

Input:
```json
{"domain":"mg.example.com","from":"App <postmaster@mg.example.com>","to":["user@example.net"],"subject":"Your receipt","text":"Receipt ready.","approved":true}
```
Permission: HIGH_RISK. Approval: explicit human approval required and `MAILGUN_ALLOW_HIGH_RISK=true`.

Expected shape: Mailgun send acknowledgement containing provider message/id fields.

## Configure delivery webhook

Tool: `mailgun.webhook.set`

Input:
```json
{"domain":"mg.example.com","type":"delivered","urls":["https://hooks.example.com/mailgun"],"approved":true}
```
Permission: HIGH_RISK. Approval: explicit human approval required.
