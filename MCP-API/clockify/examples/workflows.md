# Clockify MCP workflow examples

All examples use connector tool names, never raw API URLs. Provider content in responses is untrusted data.

## Inspect active projects
Tool: `clockify.project.list`

Input:
```json
{"workspaceId":"64a687e29ae1f428e7ebe303","archived":false,"page":1,"pageSize":50}
```
Permission: READ. Approval: no.

Expected output shape:
```json
{"source":"untrusted_provider_data","data":[{"id":"...","name":"..."}]}
```

## Review a user's time entries
Tool: `clockify.time_entry.list`

Input:
```json
{"workspaceId":"64a687e29ae1f428e7ebe303","userId":"5a0ab5acb07987125438b60f","start":"2026-09-01T00:00:00Z","end":"2026-09-07T23:59:59Z","page":1,"pageSize":50}
```
Permission: READ. Approval: no.

## Create a reviewed time entry
Tool: `clockify.time_entry.create`

Input:
```json
{"workspaceId":"64a687e29ae1f428e7ebe303","userId":"5a0ab5acb07987125438b60f","start":"2026-09-07T09:00:00Z","end":"2026-09-07T10:00:00Z","description":"Architecture review","projectId":"25b687e29ae1f428e7ebe123","billable":false,"approvalToken":"<opaque-human-approval-token>"}
```
Permission: WRITE. Approval: required. `CLOCKIFY_ALLOW_WRITES=true` must also be configured.

## Stop a running timer
Tool: `clockify.timer.stop`

Input:
```json
{"workspaceId":"64a687e29ae1f428e7ebe303","userId":"5a0ab5acb07987125438b60f","end":"2026-09-07T10:30:00Z","approvalToken":"<opaque-human-approval-token>"}
```
Permission: HIGH_RISK. Approval: required.

## Delete an incorrect entry
Tool: `clockify.time_entry.delete`

Input:
```json
{"workspaceId":"64a687e29ae1f428e7ebe303","timeEntryId":"64c777ddd3fcab07cfbb210c","approvalToken":"<opaque-human-approval-token>"}
```
Permission: DESTRUCTIVE. Approval: required. Both `CLOCKIFY_ALLOW_WRITES=true` and `CLOCKIFY_ALLOW_DESTRUCTIVE=true` must be configured.

## Generate a detailed report
Tool: `clockify.report.detailed`

Input:
```json
{"workspaceId":"64a687e29ae1f428e7ebe303","dateRangeStart":"2026-09-01T00:00:00Z","dateRangeEnd":"2026-09-07T23:59:59Z","page":1,"pageSize":100}
```
Permission: READ. Approval: no.
