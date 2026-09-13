# PandaDoc MCP Connector Examples

## 1. Find a template

Tool: `pandadoc.template.list`

```json
{ "q": "Master Services Agreement", "count": 10, "page": 1 }
```

Permission: READ. Approval: not required.

Expected output shape: MCP text content containing `{ provider, tool, risk, untrusted_provider_content, result }`, where `result` is the PandaDoc template-list response.

## 2. Create a document from a template

Tool: `pandadoc.document.create_from_template`

```json
{
  "name": "MSA - Acme Corp",
  "template_uuid": "ustHNnVaPCD6MzuoNBbZ8L",
  "recipients": [
    { "email": "signer@example.com", "first_name": "Jane", "last_name": "Roe", "role": "Signer" }
  ],
  "tags": ["enterprise"],
  "approval": "approved"
}
```

Permission: WRITE. Approval: required. The resulting document is created asynchronously and normally starts in `document.uploaded`; check `pandadoc.document.status` until it reaches `document.draft` before sending.

## 3. Send for signature

Tool: `pandadoc.document.send`

```json
{
  "document_id": "BhVzRcxH9Z2LgfPPGXFUBa",
  "subject": "Please review and sign",
  "message": "Please review the agreement.",
  "silent": false,
  "approval": "approved-high-risk"
}
```

Permission: HIGH_RISK. Approval: explicit high-risk approval required because this sends external notifications and starts a signature workflow.

## 4. Send a reminder

Tool: `pandadoc.document.remind`

```json
{
  "document_id": "BhVzRcxH9Z2LgfPPGXFUBa",
  "reminders": [
    {
      "recipient_id": "x6BKMCejrEdpBjzcUMvgwZ",
      "delivery_methods": { "email": true, "sms": false },
      "email_customization": { "subject": "Friendly reminder", "message": "Please complete the signing process." }
    }
  ],
  "approval": "approved-high-risk"
}
```

Permission: HIGH_RISK. Approval: explicit high-risk approval required.

## 5. Create a webhook subscription

Tool: `pandadoc.webhook.create`

```json
{
  "name": "Contract status events",
  "url": "https://example.com/webhooks/pandadoc",
  "triggers": ["document_state_changed", "document_completed_pdf_ready"],
  "payload": ["metadata", "fields"],
  "active": true,
  "approval": "approved"
}
```

Permission: WRITE. Approval: required. Only HTTPS callback URLs are accepted by the connector.
