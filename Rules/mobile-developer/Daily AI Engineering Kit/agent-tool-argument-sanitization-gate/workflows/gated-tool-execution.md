# Gated Tool Execution Workflow

```text
Trigger -> Context -> Plan request -> Schema check -> Static gate
                                      | blocked -> preserve evidence -> stop
                                      | approval_required -> human approval -> controlled execution
                                      | passed -> least-privilege execution
                                                           -> independent verify -> complete
```

## Trigger
An AI agent proposes a shell, file, Git, infrastructure, database CLI, deployment, or other high-impact tool call.

## Entry conditions
Repository root and target environment are known; the host can intercept the tool call before execution; policy exists.

## Inputs
Task intent, available tool schema, structured request JSON, repository root, `config/policy.yaml`.

## Stages
1. **Context — Tool Request Planner:** inspect only the repository/resources needed to understand the requested effect.
2. **Plan — Planner:** select the least-privileged tool and minimal arguments; define expected effect and read-only verification.
3. **Contract — deterministic:** request must conform to `schemas/tool-request.schema.json`.
4. **Gate — deterministic:** run `python scripts/tool_argument_gate.py --request <request.json> --policy config/policy.yaml --repo-root <repo> --output gate-result.json`.
5. **Checkpoint:** exit 2 blocks; exit 4 enters approval path; exit 0 permits only the host-authorized operation.
6. **Approval path:** run `skills/high-risk-command-review.md`; human approves the exact request/target. Any change invalidates approval.
7. **Execute — host tool layer:** execute exactly once unless the operation is known idempotent and a retry is explicitly allowed.
8. **Verify — Tool Request Verifier:** reproduce the gate result and execute the predefined non-destructive verification checks.
9. **Complete:** return verified result, evidence, and residual risk.

## Produced artifacts
Request JSON, gate result JSON, approval reference if required, execution output, verification evidence.

## Checkpoints
- Request contract valid.
- Repository root/target environment explicit.
- Gate result current for exact request.
- Required approval present before execution.
- Verification evidence collected after execution.

## Retry rules
- Gate/config transient tool failure: retry once with unchanged inputs.
- Execution transient failure: retry at most once only when the action is proven idempotent; otherwise stop.
- Verification transient failure: retry once.
- Validation, permission, policy, or approval failures are not retryable by changing permissions or weakening controls.

## Stop conditions
Blocked gate result, unknown target, secret exposure, stale approval, changed request after gate/approval, permission escalation, non-idempotent ambiguous execution outcome, or verification mismatch.

## Approval points
Production deployment/configuration, destructive SQL, database schema change, deletion, force push/history rewrite, infrastructure mutation, secret/security-control changes, and all policy-classified commands.

## Failure paths
If execution outcome is ambiguous, do not blindly retry. Inspect state using read-only tools. If state cannot be determined, escalate with preserved request/output evidence.

## Definition of Done
The exact request was contract-validated and gated; permissions remained least-privileged; required approval matched the request; execution outcome is known; independent verification passed; no blocking finding remains; residual risk is documented.
