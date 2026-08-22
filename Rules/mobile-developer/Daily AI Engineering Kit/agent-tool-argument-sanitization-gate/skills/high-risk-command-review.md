# High-Risk Command Review Skill

## Purpose
Review commands that are not outright forbidden but can materially alter repositories, infrastructure, databases, deployments, or remote state.

## Inputs
Exact gated request artifact, target environment, task intent, expected changes, rollback/recovery plan, and gate result.

## Preconditions
Gate status is `approval_required`; no execution has happened.

## Process
1. Confirm the requested effect is necessary and cannot be achieved with a lower-risk read-only action.
2. Verify target repository, environment, branch, cluster, workspace, or database is explicit.
3. Check the command does not contain unrelated operations, shell chaining, hidden redirection, credential material, or path traversal.
4. Identify irreversible or remotely persistent effects.
5. Define a concrete verification command/query that is read-only.
6. Define rollback or compensation steps; do not auto-run them.
7. Record the exact request artifact and its hash or immutable reference in the approval packet.
8. Require explicit human approval before execution.
9. If the request changes after approval, invalidate approval and rerun the gate.
10. After controlled execution, run read-only verification and report actual vs expected effects.

## Expected output
Approval status, affected systems, exact request reference, risk, rollback/compensation, verification plan, and residual uncertainty.

## Verification
Approval refers to the exact request and target. Post-execution evidence confirms the intended effect without unrelated changes.

## Failure handling
Ambiguous target, missing rollback, missing approval, or inability to verify postconditions blocks execution.

## Stop conditions
Any forbidden operation, security weakening, permission expansion, secret change, production deployment/configuration change, destructive database action, force push/history rewrite, or irreversible infrastructure operation without explicit approval.
