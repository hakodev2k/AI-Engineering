# Formstack MCP workflow examples

Provider responses are returned as untrusted data. IDs below are examples only.

## Inspect a form and recent submissions

1. Tool: `formstack.form.get`
   Input: `{ "formId": 12345, "withFields": true }`
   Permission: READ
   Approval: no

2. Tool: `formstack.submission.list`
   Input: `{ "formId": 12345, "pageNumber": 1, "pageSize": 25, "order": "DESC", "data": true }`
   Permission: READ
   Approval: no

Expected output shape:

```json
{
  "provider": "formstack",
  "untrusted_data": true,
  "result": {}
}
```

## Create a field

Tool: `formstack.field.create`

```json
{
  "formId": 12345,
  "label": "Customer email",
  "type": "email",
  "required": true,
  "approved": true
}
```

Permission: WRITE. Approval is required by default.

## Create a webhook

Tool: `formstack.webhook.create`

```json
{
  "formId": 12345,
  "name": "CRM intake",
  "url": "https://hooks.example.com/formstack",
  "contentType": "json",
  "standardizeValues": true,
  "approved": true
}
```

Permission: HIGH_RISK. Explicit human approval is always required. The connector accepts HTTPS public destinations only.

## Delete a submission

Tool: `formstack.submission.delete`

```json
{
  "submissionId": 98765,
  "approved": true
}
```

Permission: DESTRUCTIVE. Destructive tools are disabled until `FORMSTACK_DESTRUCTIVE_ENABLED=true` and still require explicit approval.
