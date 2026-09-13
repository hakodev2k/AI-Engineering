# Copper MCP workflow examples

## Search a person

Tool: `copper.person.search`

```json
{
  "name": "Ada Lovelace",
  "page_size": 25
}
```

Permission: READ. Approval: not required.

Expected output: an MCP text result containing Copper's matching person records under `result`. Provider content is explicitly marked untrusted.

## Create a company

Tool: `copper.company.create`

```json
{
  "name": "Example Labs",
  "email_domain": "example.com",
  "approval": "approved"
}
```

Permission: WRITE. Approval: required. `COPPER_ALLOW_WRITES=true` must also be configured by the operator.

Expected output: the created company object returned by Copper.

## Search deals, then update one

First call `copper.opportunity.search`:

```json
{
  "name": "Renewal",
  "page_size": 50
}
```

Then call `copper.opportunity.update` with the chosen ID:

```json
{
  "opportunity_id": 12345,
  "pipeline_stage_id": 67890,
  "approval": "approved"
}
```

The search is READ. The update is WRITE and requires approval.

## Record an activity

Tool: `copper.activity.create`

```json
{
  "parent_id": 12345,
  "parent_type": "opportunity",
  "activity_type_id": 987,
  "details": "Customer confirmed next-step meeting.",
  "approval": "approved"
}
```

Permission: WRITE. Approval: required.
