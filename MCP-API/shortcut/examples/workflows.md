# Shortcut MCP workflow examples

## Triage and update a story

1. `shortcut.story.search`
   - Input: `{ "query": "owner:me state:started", "pageSize": 20, "detail": "slim" }`
   - Permission: READ
   - Approval: no
2. `shortcut.story.get`
   - Input: `{ "storyId": 12345 }`
   - Permission: READ
   - Approval: no
3. `shortcut.story.update`
   - Input: `{ "storyId": 12345, "workflowStateId": 500000001, "approved": true }`
   - Permission: WRITE
   - Approval: yes when configured
4. `shortcut.story.comment.create`
   - Input: `{ "storyId": 12345, "text": "Implementation is ready for review.", "approved": true }`
   - Permission: WRITE
   - Approval: yes when configured

Expected output is JSON under `data`, plus `security.providerContentIsUntrusted=true`.

## Plan work from workspace structure

Use `shortcut.workflow.list`, `shortcut.team.list`, `shortcut.iteration.list`, and `shortcut.objective.list` to discover IDs before creating a Story or Epic. Create operations require WRITE permission and, by default, explicit human approval.
