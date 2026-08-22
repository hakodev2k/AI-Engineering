# Workflow: MCP Permission Escalation Gate

## Trigger
Any agent intends to invoke an MCP/tool capability with sensitive read access, mutation, elevated permissions, deployment, deletion, secret access, or production scope.

## Entry conditions
Task intent is known; requested tool/action/resources can be named; repository policy is available.

## Inputs
Tool request JSON conforming to `schemas/tool-request.schema.json`, task acceptance criteria, current permission set, and optional approval evidence.

## Stages
1. **Context** — requester gathers only relevant repository/tool context.
2. **Normalize** — requester creates the structured request.
3. **Policy review** — Tool Policy Reviewer checks necessity, risk, and scope.
4. **Deterministic gate** — run `python scripts/permission_gate.py <request.json>`.
5. **Approval checkpoint** — if required, stop and obtain explicit human approval using `templates/approval-request.md`.
6. **Re-gate** — rerun with `--approved --approval-id <id>`; any request change invalidates prior approval.
7. **Execute** — invoke only the approved tool/action/resources.
8. **Verify** — Verification Agent compares execution evidence to approval and acceptance criteria.
9. **Complete** — record verified result and remaining risk.

## Responsible agents
Requester/implementation agent: context, normalization, execution. Tool Policy Reviewer: pre-execution authorization review. Verification Agent: independent post-execution verification.

## Tools
Repository read tools, policy/schema files, `scripts/permission_gate.py`, target MCP/tool only after allow.

## Produced artifacts
Normalized request, gate result, optional approval record, execution evidence, verification result.

## Checkpoints
Gate decision blocks execution. Human approval blocks high-risk actions. Independent verification blocks success status.

## Retry rules
Maximum two retries for transient tool/validation failures. Permission denial is non-retryable unless scope/evidence/approval changes. Preserve prior request, error, gate output, and approval evidence on every retry.

## Approval points
External writes, deletion, deployment, secret access, permission changes, production mutation, breaking/security-weakening changes.

## Failure paths
Validation failure → fix request, max two attempts. Tool unavailable → preserve evidence and stop. Permission failure → no unchanged retry. Verification failure → stop; do not claim completion; propose rollback if safe and approved.

## Definition of Done
Request is valid; policy decision exists; required approval exists; execution matches approved scope; independent verification is `verified`; no unauthorized persistent permissions remain; unresolved risks are recorded.
