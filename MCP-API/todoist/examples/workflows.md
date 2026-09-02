# Todoist connector workflows

## Weekly review

1. `todoist.project.list` — `{ "limit": 100 }` — READ, no approval.
2. `todoist.task.search` — `{ "filter": "overdue | today", "limit": 100 }` — READ, no approval.
3. `todoist.activity.list` — `{ "limit": 50 }` — READ, no approval.

Expected output is provider JSON for the requested page. When `TODOIST_MCP_ACCESS_TOKEN` is configured, filtered task search is routed to the official Todoist MCP `find-tasks` tool; otherwise the official API v1 is used.

## Capture a task

Tool: `todoist.task.create`

Input:
```json
{ "content": "Review launch checklist", "projectId": "PROJECT_ID", "dueString": "tomorrow", "priority": 2 }
```

Permission: WRITE. Approval: required by default. Exact approval fingerprint: `todoist.task.create:PROJECT_ID`.

## Complete a task

Tool: `todoist.task.complete`

Input: `{ "taskId": "TASK_ID" }`

Permission: WRITE. Approval: required by default. Exact approval fingerprint: `todoist.task.complete:TASK_ID`.

## Collaborate with context

1. `todoist.comment.list` with exactly one of `taskId` or `projectId` — READ.
2. `todoist.comment.add` with `content` and the same target — WRITE, approval required by default.
