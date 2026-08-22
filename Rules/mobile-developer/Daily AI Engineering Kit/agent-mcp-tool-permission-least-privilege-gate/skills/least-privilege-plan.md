# Skill: Least-Privilege Plan

## Purpose
Convert the permission inventory into the smallest executable capability set for one task.

## Inputs
Permission inventory, task acceptance criteria, `config/policy.json`.

## Preconditions
Inventory is complete enough to identify required actions and unknown capabilities have been isolated.

## Process
1. Decompose the task into stages and list the exact tool action needed at each stage.
2. Prefer read-only evidence collection before any mutation.
3. Remove tools not needed for the current stage.
4. Replace wildcard scopes with the narrowest resource-specific scope available.
5. Separate credentials by environment and refuse production credentials for non-production verification.
6. For each write/destructive/secret/production/permission-change/external-publish action, create an approval checkpoint before invocation.
7. Set permissions to expire at task completion when the platform supports ephemeral grants.
8. Define argument constraints such as repository, path prefix, host, database, branch, operation type, and maximum batch size.
9. Define verification evidence that must exist after each mutation.
10. Produce the execution plan and hand it to the implementation agent.

## Expected output
A staged plan containing required tools, exact scopes, argument boundaries, approvals, outputs, verification checks, and stop conditions.

## Verification
No stage has a permission broader than its operation requires. All policy-listed high-risk actions have explicit approval checkpoints.

## Failure handling
If narrowing a scope makes the task impossible, do not silently broaden it. Escalate with the exact missing capability and expected consequence.

## Stop conditions
Stop before any permission grant, secret read, production write, destructive action, deployment, permission change, or external publication without explicit approval.
