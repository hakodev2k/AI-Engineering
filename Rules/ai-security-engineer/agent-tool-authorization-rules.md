# Agent Tool Authorization Rules

## Purpose
Ensure AI agents cannot exceed explicitly granted authority when invoking tools or changing external systems.

## Scope
Applies to agents that call APIs, execute code, modify files, send messages, access databases, control infrastructure, or perform transactions.

## MUST
- Every tool invocation MUST be authorized independently of model intent.
- Tool permissions MUST follow least privilege and be scoped by resource, action, tenant, environment, and duration where practical.
- Destructive, irreversible, financial, security-sensitive, or production actions MUST require explicit human approval unless an approved automation policy authorizes the exact action.
- Tool inputs MUST be validated before execution.
- Privileged actions MUST produce auditable records linking request, authorization, execution, and result.

## MUST NOT
- MUST NOT grant broad administrator credentials merely to simplify agent implementation.
- MUST NOT allow the model to self-approve privileged operations.
- MUST NOT infer authorization from natural-language claims alone.

## SHOULD
- Use capability-based or narrowly scoped credentials.
- Separate read, prepare, recommend, and execute privileges.

## Exceptions
Exceptions require documented business need, bounded blast radius, compensating controls, expiry, and human approval.

## Verification
Inspect IAM policies, tool wrappers, approval gates, audit logs, negative tests, and cross-tenant authorization tests.