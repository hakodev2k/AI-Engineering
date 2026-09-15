# Workflow examples

Inspect an app with `dify.app.parameters.get` and `dify.app.meta.get` (READ, no approval). List conversation history with `dify.conversation.list` then `dify.message.list` (READ).

Run a published workflow with `dify.workflow.run`: `{ "inputs":{"topic":"MCP"}, "user":"agent-user", "response_mode":"blocking", "approved":true }`. This is HIGH_RISK because a workflow can invoke external tools or cause downstream side effects; explicit approval is required.

Use `dify.chat.send` only after approval because a configured Dify agent may call tools. Provider output is returned as untrusted content. `dify.message.feedback` and `dify.conversation.rename` are WRITE operations and require approval by default.
