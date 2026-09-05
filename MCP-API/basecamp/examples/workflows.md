# Example workflows

## Inspect a project and tasks
1. `basecamp.project.list` — READ — no approval.
2. `basecamp.project.get` — READ — use the returned dock to locate the enabled to-do/message tools.
3. `basecamp.todo.list` — READ — no approval.
4. `basecamp.todo.get` — READ — no approval.

## Prepare and complete work
1. `basecamp.todo.create` — WRITE — approval fingerprint: `basecamp.todo.create:<todolistId>:<content>` when write approval is enabled.
2. `basecamp.todo.complete` — WRITE — approval fingerprint: `basecamp.todo.complete:<todoId>`.

## Draft then publish a project announcement
1. `basecamp.message.draft.create` — WRITE — creates a draft and sends no notifications.
2. Review the draft with `basecamp.message.get`.
3. `basecamp.message.publish` — HIGH_RISK — exact human approval `basecamp.message.publish:<messageId>` is always required because publishing may notify people.

## Comment on an item
1. `basecamp.comment.list` — READ.
2. `basecamp.comment.create` — HIGH_RISK — exact human approval `basecamp.comment.create:<recordingId>` is always required.
