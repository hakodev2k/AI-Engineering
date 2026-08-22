# Workflow: Scope and Verify MCP Capabilities

## Trigger
Adding an MCP server/tool, widening a credential, onboarding a new repository/root/host, or detecting an out-of-scope attempt.

## Goal
Ensure model-selected targets cannot exceed explicit task capability policy.

## Inputs
Tool schemas, credential reach, task requirements, current traces, policy.

## Baseline
Document effective credential access and sample tool calls. Record how many current calls lack deterministic target-scope enforcement.

## Stages
1. **Observe** — inventory tools, target parameters, operations, credential reach.
2. **Measure baseline** — calculate policy coverage and high-impact calls without deterministic scope gate.
3. **Diagnose** — identify scope gap: broad token, unbounded target, path normalization, missing approval, or stale policy.
4. **Form hypothesis** — define narrow capability envelope needed by real tasks.
5. **Implement** — configure `policy.json`, integrate pre-invocation hook.
6. **Measure again** — shadow-evaluate normal traces and attack fixtures.
7. **Improved?** If attacks still pass or valid scope is undefined, correct policy/normalization; maximum 2 cycles.
8. **Verify** — independent security verifier runs required attack matrix.
9. **Enforce** — enable blocking mode after approval.

## Responsible agent
Implementation: platform engineer. Verification: `subagents/security-verifier.md`.

## Tools
Tool schema inspection, credential inventory, policy evaluator, unit tests, audit logs.

## Outputs
Baseline, policy, decision reports, attack-test results, verification record.

## Checkpoints
C1 scope inventory complete; C2 policy explicit; C3 attack suite blocked; C4 normal fixtures pass; C5 independent verifier approves.

## Metrics
Policy coverage, blocked out-of-scope attempts, false denies, approval coverage, unknown-tool attempts.

## Retry policy
Maximum 2 implementation correction cycles. A denied tool request itself may be retried once only with corrected externally approved scope.

## Stop conditions
Any attack fixture remains allowed after 2 cycles, normalization is ambiguous, or required policy would broaden security beyond approved scope.

## Failure path
Disable the affected tool or keep it in deny/review mode, preserve audit evidence, and escalate. Never broaden permissions merely to restore agent success.

## Verification
Run repository, branch, path traversal, host, unknown tool, missing approval, and valid-control fixtures.

## Definition of Done
Evidence documented; baseline measured; policy enforced; attack fixtures blocked; valid fixtures pass; approval binding verified; risks recorded; independent verification passes.
