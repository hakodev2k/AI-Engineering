# MCP Permission Safety Rules

## MUST
- Default-deny requests with missing tool, action, resource scope, reason, or risk.
- Use the narrowest resource scope that can complete the task.
- Require explicit human approval for external writes, deletion, deployment, secret access, permission changes, and production mutation.
- Bind approval to one tool, action, resource set, and bounded duration.
- Re-evaluate authorization when any approved field changes.
- Preserve policy decision and execution evidence without secret values.
- Stop when the requested action exceeds the caller's configured permissions.

## MUST NOT
- Do not treat prior approval as approval for a new resource or action.
- Do not use wildcard resource scopes such as `*`, `/**`, or `all`.
- Do not silently add scopes, credentials, MCP servers, or permissions to unblock a task.
- Do not weaken authentication, authorization, sandboxing, or audit controls.
- Do not print tokens, secrets, credentials, private keys, or secret-bearing environment values.
- Do not retry permission-denied actions unchanged.
- Do not let the implementation agent self-approve a high-risk request.

## SHOULD
- Prefer read-only inspection before mutation.
- Prefer local/sandbox verification before external or production actions.
- Expire elevated grants as soon as the approved action finishes.
- Separate implementation and verification responsibilities for high-risk changes.
