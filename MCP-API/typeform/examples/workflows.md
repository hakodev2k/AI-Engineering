# Typeform connector workflows

## Read and analyze responses
1. `typeform.account.list` — READ, no approval.
2. `typeform.form.list` — READ, no approval.
3. `typeform.insight.discover` — READ, no approval.
4. `typeform.insight.aggregate` — READ, no approval.
5. `typeform.response.list` — READ, REST fallback for full response rows.

## Safely edit and publish a form
1. `typeform.form.capabilities.get`
2. `typeform.form.get`
3. `typeform.form.validate_patch`
4. `typeform.form.patch` — WRITE, approval required by default.
5. `typeform.form.publish` — HIGH_RISK, explicit approval fingerprint required.

## Configure a real-time response webhook
Tool: `typeform.webhook.upsert`
Input: `{ "formId": "FORM_ID", "tag": "crm", "url": "https://example.com/typeform", "enabled": true, "verifySsl": true }`
Permission: WRITE. Approval: required by default.
