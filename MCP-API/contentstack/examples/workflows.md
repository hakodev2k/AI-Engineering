# Contentstack connector workflows

## Discover content

Tool: `contentstack.content_type.list`

```json
{"skip":0,"limit":25}
```

Permission: READ. Approval: no. Expected output shape: `{ "untrustedProviderData": true, "data": { "content_types": [...] } }`.

Then inspect one model with `contentstack.content_type.get` and list entries with `contentstack.entry.list`.

## Prepare and create a draft entry

Tool: `contentstack.entry.create`

```json
{
  "contentTypeUid":"article",
  "locale":"en-us",
  "entry":{"title":"Draft title","url":"/draft-title"},
  "approvalToken":"<64-char HMAC generated outside the model>"
}
```

Permission: WRITE. Approval: required by default. Expected output contains the provider-created `entry` object.

## Publish reviewed content

Tool: `contentstack.entry.publish`

```json
{
  "contentTypeUid":"article",
  "entryUid":"blt_entry_uid",
  "environments":["blt_environment_uid"],
  "locales":["en-us"],
  "approvalToken":"<64-char HMAC generated outside the model>"
}
```

Permission: HIGH_RISK. Approval: always required because publishing changes externally served content.

## Remove an entry

Tool: `contentstack.entry.delete`

```json
{
  "contentTypeUid":"article",
  "entryUid":"blt_entry_uid",
  "confirmEntryUid":"blt_entry_uid",
  "locale":"en-us",
  "approvalToken":"<64-char HMAC generated outside the model>"
}
```

Permission: DESTRUCTIVE. Approval: always required and `CONTENTSTACK_ENABLE_DESTRUCTIVE=true` must be set by the operator. Deletes are never retried automatically.
