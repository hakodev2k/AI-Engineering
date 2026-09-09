# Keap MCP tool-call examples

Provider responses are returned as JSON inside MCP text content and are explicitly marked `untrusted_data: true`.

## Find a contact by email

Tool: `keap.contact.list`  
Permission: READ  
Approval: No

```json
{
  "email": "customer@example.com",
  "limit": 20,
  "offset": 0,
  "optional_properties": ["custom_fields", "tag_ids"]
}
```

Expected envelope shape:

```json
{
  "provider": "keap",
  "untrusted_data": true,
  "result": {
    "contacts": [],
    "count": 0
  }
}
```

## Create a contact

Tool: `keap.contact.create`  
Permission: WRITE  
Approval: Yes when `KEAP_REQUIRE_WRITE_APPROVAL=true` (default)

```json
{
  "given_name": "Ada",
  "family_name": "Lovelace",
  "email_addresses": [
    { "email": "ada@example.com", "field": "EMAIL1" }
  ],
  "duplicate_option": "Email",
  "approved": true
}
```

## Apply tags

Tool: `keap.contact.tag.apply`  
Permission: WRITE  
Approval: Yes by default

```json
{
  "contact_id": 123,
  "tag_ids": [45, 67],
  "approved": true
}
```

## Inspect sent-email history

Tool: `keap.contact.email.list`  
Permission: READ  
Approval: No

```json
{
  "contact_id": 123,
  "limit": 100,
  "offset": 0
}
```

## Create a REST Hook subscription

Tool: `keap.webhook.create`  
Permission: HIGH_RISK  
Approval: Always required

```json
{
  "event_key": "contact.update",
  "hook_url": "https://example.com/webhooks/keap",
  "approved": true
}
```

The receiver must complete Keap's REST Hook verification handshake before deliveries begin.

## Delete a REST Hook subscription

Tool: `keap.webhook.delete`  
Permission: DESTRUCTIVE  
Approval: Always required; additionally disabled until `KEAP_DESTRUCTIVE_ENABLED=true`

```json
{
  "hook_id": 42,
  "approved": true
}
```
