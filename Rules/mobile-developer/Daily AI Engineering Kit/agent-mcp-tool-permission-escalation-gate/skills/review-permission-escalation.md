# Skill: Review Permission Escalation

## Purpose
Review requests that would elevate an agent from current permissions to a more powerful tool, resource scope, or action.

## Trigger
A request for external writes, deletion, deployment, secret access, permission changes, production mutation, wildcard resources, or a new tool not in the active allowlist.

## Inputs
Current permissions, requested permissions, affected resources, intended duration, task requirement, safer alternatives, rollback path, and evidence.

## Procedure
1. Compare current vs requested capabilities explicitly.
2. Identify the minimum capability needed to satisfy the task.
3. Reject wildcard or organization-wide scope when a narrower scope exists.
4. Check whether a read-only or local simulation can answer the question first.
5. Classify blast radius: local, repository, environment, account, production.
6. Identify irreversible effects and rollback limitations.
7. Require explicit human approval for every action listed in `config/policy.yaml`.
8. Limit elevated access to at most 30 minutes and named resources.
9. Handoff to `subagents/verification-agent.md` after execution for independent verification.

## Evidence requirements
Record requested capability, chosen scope, rejected alternatives, approval identifier, execution result, and whether access was revoked/expired.

## Verification
Approval must match action, tool, resource scope, and duration exactly. Reapproval is required after material changes.

## Failure handling
Do not retry denied permission requests unchanged. A revised request must contain narrower scope, new evidence, or explicit approval.

## Stop conditions
Stop when rollback is impossible and approval is absent, scope is unknown, or the request requires disabling a security control.
