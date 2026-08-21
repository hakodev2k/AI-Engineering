# Skill: Permission Inventory

## Purpose
Build an evidence-based inventory of agent, MCP server, tool, scope, resource, and runtime permissions before execution.

## When to use
Use before enabling a new MCP server, adding a tool, changing tool configuration, broadening an agent role, or investigating unexpected tool access.

## Inputs
- Repository or agent configuration
- MCP/tool definitions
- Runtime environment and target resources
- Task intent and required operations
- `config/policy.json`

## Preconditions
The task boundary and target environment are known. Read-only inspection is available.

## Allowed tools
Repository search, file read, configuration inspection, MCP/tool metadata inspection, read-only runtime introspection.

## Constraints
Do not invoke write/destructive tools merely to discover their permissions. Do not request secrets to prove a tool could read secrets.

## Procedure
1. Identify every agent and MCP server involved in the task.
2. Enumerate exposed tools and map each tool to concrete actions and resources.
3. Normalize each capability into `tool`, `scope`, `action`, `risk`, and `resource`.
4. Mark capabilities actually required by the task.
5. Mark capabilities exposed but not required as excess permissions.
6. Identify wildcard scopes, environment-wide scopes, implicit credentials, inherited roles, and tool wrappers that hide downstream privileges.
7. Record whether each permission expires after the task or is persistent.
8. Produce a permission request object for every required non-read capability using `schemas/permission-request.schema.json`.
9. Hand findings to the planner; do not grant permissions.

## Expected output
A permission inventory containing facts, evidence locations, required scopes, excess scopes, unknowns, and approval candidates.

## Verification
Every enabled tool is represented; every non-read action has a risk classification; wildcard/unknown access is explicitly recorded.

## Failure handling
If tool metadata is incomplete, classify the capability as unknown and block execution under default-deny. If runtime introspection fails, retry at most twice only for transient tool failures, preserving error evidence.

## Stop conditions
Stop when a required permission cannot be identified without exercising a dangerous action, when an unknown tool would be executed, or when permission discovery requires secret disclosure.
