# Permission Rules

## MUST
- Default-deny unknown tools, scopes, resources, and actions.
- Inventory every enabled MCP/tool capability before execution.
- Bind permissions to the current task and narrowest practical resource.
- Validate tool arguments before invocation.
- Require explicit human approval for write, destructive, production, secret, permission-change, deployment, external publication, force-push, and infrastructure actions.
- Preserve evidence for grants, denials, approvals, tool invocations, failures, and verification results.
- Revoke or expire temporary permissions after task completion when supported.
- Separate facts from hypotheses when inferring hidden downstream privileges.

## MUST NOT
- Do not silently broaden a scope to unblock execution.
- Do not treat tool availability as authorization to use it.
- Do not execute unknown or undocumented tools under an allow-by-default policy.
- Do not expose secrets in prompts, logs, reports, test fixtures, or approval requests.
- Do not use production credentials for non-production validation.
- Do not allow an implementation agent to self-approve a high-risk capability.
- Do not weaken security controls, bypass approval, or substitute a broader credential when a narrow grant fails.
- Do not retry permission-denied actions as if they were transient failures.

## SHOULD
- Prefer read-only tools and staged capability activation.
- Prefer resource/path/branch-specific scopes over repository/account/environment wildcards.
- Prefer short-lived credentials and task-scoped grants.
- Verify runtime-effective permissions, not only static configuration.
- Keep verifier responsibilities separate from the implementing agent for high-risk changes.
