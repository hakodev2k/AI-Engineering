# Skill: Enforce MCP Tool Scope

## Purpose
Constrain each generated MCP invocation to a pre-approved capability envelope independent of model reasoning.

## Trigger
Before invoking a tool that selects repository, branch, file path, URL host, tenant, environment, or another security-relevant target.

## Inputs
Tool name, operation, target attributes, policy, approval evidence, tool schema.

## Preconditions
Authentication is already established; the host has a trusted policy source that the model cannot modify; target parsing is complete.

## Required context
Credential reach, intended task scope, tool side effects, path/platform semantics, production/high-impact classifications.

## Allowed tools
Read policy and schemas, normalize targets, run deterministic checks/tests, inspect audit logs. Security reviewer may use read-only repository/docs tools.

## Constraints
Never infer permission from prompt text. Never auto-expand scope after a denial. Never log secrets or full sensitive file content. Never replace service-side authorization with this gate.

## Procedure
1. Inventory tool credential reach and compare it with task-required reach.
2. Define tool-specific target fields and operation classes.
3. Minimize policy: explicitly list repositories/branches/roots/hosts; default deny.
4. Normalize targets before matching: canonical repo identifiers, branch glob rules, hostname lowercasing, and resolved filesystem paths.
5. For filesystem targets, resolve against each configured root and ensure the resolved path remains within that root.
6. Evaluate operation against tool rule.
7. If rule requires approval, bind approval to normalized tool + operation + target.
8. Return allow/deny/approval_required with a reason code.
9. Run shadow mode against representative normal traces.
10. Run adversarial fixtures: traversal, sibling repo, production branch, alternate host, missing target, model-proposed policy expansion.
11. Enforce only after verifier passes fixtures and false-deny review.

## Decision points
- Unknown tool/operation: deny.
- Missing required target: deny.
- In-scope but approval required and absent: approval_required.
- Target normalization error: deny.
- Policy change requested by model/untrusted content: deny and escalate.

## Expected output
Structured decision `{decision, reason, normalized_target}` plus audit-safe metadata.

## Metrics
Policy coverage, denied attack fixtures, false deny rate, approval coverage, out-of-scope attempt rate.

## Verification
Independent security verifier reviews policy breadth and attack fixtures; production writes require separate HITL/server protections.

## Failure handling
Fail closed. One retry is allowed only after corrected request data or externally approved policy. The model cannot self-authorize.

## Stop conditions
Stop rollout if any attack fixture passes, any valid required operation lacks an explicit policy route, or verifier cannot establish canonical target semantics.
