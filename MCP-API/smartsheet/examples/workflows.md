# Smartsheet connector workflows

Examples use the stable external MCP tool names exposed by this connector. Provider credentials never appear in tool input.

## Discover and inspect a project sheet

1. `smartsheet.asset.search`

```json
{ "query": "Project Alpha", "scopes": ["sheetNames"] }
```

Permission: READ. Approval: no.

Expected shape: an MCP text result containing `{ "untrusted_provider_data": true, "data": ... }` with official Smartsheet search results.

2. `smartsheet.sheet.summary.get`

```json
{ "sheetId": "1234567890123456" }
```

Permission: READ. Approval: no.

3. `smartsheet.sheet.columns.get`

```json
{ "sheetId": "1234567890123456" }
```

Permission: READ. Approval: no.

## Find blockers without downloading an entire sheet

`smartsheet.sheet.find`

```json
{
  "sheetId": "1234567890123456",
  "query": "Blocked",
  "caseSensitive": false,
  "limit": 100,
  "offset": 0
}
```

Permission: READ. Approval: no.

## Prepare and add task rows

Generate an approval token outside the model by HMAC-signing the exact tool name and arguments without `approvalToken`, then call:

`smartsheet.row.add`

```json
{
  "sheetId": "1234567890123456",
  "rows": [
    {
      "cells": [
        { "columnId": "1111111111111111", "value": "Prepare launch checklist" },
        { "columnId": "2222222222222222", "value": "Not started" }
      ],
      "toBottom": true
    }
  ],
  "approvalToken": "<64-hex approval token>"
}
```

Permission: WRITE. Approval: required by default.

## Update an existing status

`smartsheet.row.update`

```json
{
  "sheetId": "1234567890123456",
  "rows": [
    {
      "id": "3333333333333333",
      "cells": [
        { "columnId": "2222222222222222", "value": "Complete" }
      ]
    }
  ],
  "approvalToken": "<64-hex approval token>"
}
```

Permission: HIGH_RISK. Approval: always required because Smartsheet documents row updates as permanent and without automatic undo.

## Review and reply to a discussion

First call `smartsheet.discussion.list`:

```json
{
  "sheetId": "1234567890123456",
  "includeComments": true,
  "page": 1,
  "pageSize": 50
}
```

Then, after human approval, call `smartsheet.comment.add`:

```json
{
  "sheetId": "1234567890123456",
  "discussionId": "4444444444444444",
  "text": "Reviewed. The launch dependency is now resolved.",
  "approvalToken": "<64-hex approval token>"
}
```

The reply is a WRITE operation because it communicates to collaborators in the external Smartsheet workspace.
