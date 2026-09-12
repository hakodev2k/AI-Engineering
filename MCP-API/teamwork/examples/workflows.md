# Teamwork connector workflows

These examples use the connector-facing tool names. `params` are validated against the live input schema published by the fixed official Teamwork MCP tool before dispatch.

## Inspect project work

Tool: `teamwork.project.list`

```json
{
  "params": {
    "page": 1,
    "page_size": 50
  }
}
```

Permission: `projects:read`  
Risk: `READ`  
Approval: not required

Expected output shape:

```json
{
  "provider": "Teamwork.com",
  "tool": "teamwork.project.list",
  "permission": "projects:read",
  "risk": "READ",
  "untrusted_provider_content": true,
  "result": {}
}
```

## Find tasks for a project

Tool: `teamwork.task.list`

```json
{
  "params": {
    "project_id": 12345,
    "page": 1,
    "page_size": 100
  }
}
```

Permission: `tasks:read`  
Risk: `READ`  
Approval: not required

## Create a task

Tool: `teamwork.task.create`

```json
{
  "params": {
    "tasklist_id": 9876,
    "name": "Prepare client status report"
  },
  "approval": "approved"
}
```

Permission: `tasks:write`  
Risk: `WRITE`  
Approval: required; `TEAMWORK_ALLOW_WRITES=true` must also be set.

## Complete a task

Tool: `teamwork.task.complete`

```json
{
  "params": {
    "task_id": 45678
  },
  "approval": "approved-high-risk"
}
```

Permission: `tasks:write`  
Risk: `HIGH_RISK`  
Approval: required; `TEAMWORK_ALLOW_HIGH_RISK=true` must also be set.

## Time analysis

Tool: `teamwork.timelog.summarize`

```json
{
  "params": {
    "start_date": "2026-09-01",
    "end_date": "2026-09-30",
    "group_by": "project"
  }
}
```

Permission: `time:read`  
Risk: `READ`  
Approval: not required

The exact accepted fields are determined by the live Teamwork MCP schema for `twprojects-summarize_timelogs`; invalid or outdated arguments fail before any provider action is invoked.
