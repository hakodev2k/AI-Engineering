# Modal MCP workflow examples

All examples use the connector's MCP-facing tool contract. Provider responses are treated as untrusted data.

## Inspect an app

Tool: `modal.app.get`

```json
{ "name": "my-app" }
```

Permission: `READ`. Approval: no.

Expected shape:

```json
{ "appId": "ap-...", "name": "my-app" }
```

## Invoke a deployed function

Tool: `modal.function.invoke`

```json
{
  "appName": "my-app",
  "functionName": "summarize",
  "args": ["input"],
  "kwargs": {},
  "approved": true
}
```

Permission: `HIGH_RISK`. Approval: yes, because deployed function code may perform external side effects or consume billable compute.

## Create a network-restricted sandbox

Tool: `modal.sandbox.create`

```json
{
  "appName": "agent-sandboxes",
  "image": "python:3.13-slim",
  "command": ["sleep", "300"],
  "cpu": 1,
  "memoryMiB": 1024,
  "timeoutMs": 300000,
  "outboundDomainAllowlist": ["api.github.com"],
  "approved": true
}
```

Permission: `HIGH_RISK`. Approval: yes.

Expected shape:

```json
{ "sandboxId": "sb-..." }
```

## Execute an argv-style command

Tool: `modal.sandbox.exec`

```json
{
  "sandboxId": "sb-...",
  "command": ["python", "-c", "print('hello')"],
  "timeoutMs": 30000,
  "approved": true
}
```

Permission: `HIGH_RISK`. Approval: yes. The connector accepts an argument vector rather than a shell command string.

## Delete a volume

Tool: `modal.volume.delete`

```json
{ "name": "obsolete-cache", "approved": true }
```

Permission: `DESTRUCTIVE`. Approval: yes. The connector additionally requires `MODAL_ALLOW_DESTRUCTIVE=true`; otherwise deletion is denied.
