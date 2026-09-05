# Workflow: Idempotent Tool Execution

## Trigger
An agent is about to perform or retry a side-effecting tool action.

## Entry conditions
Tool and target environment are known; durable trace storage is available; key can be derived before execution.

## Inputs
Task intent, semantic request, tool contract, policy, prior trace for the idempotency key.

## Stages
1. **Context** — inspect tool semantics and prior executions.
2. **Plan** — Execution Planner classifies risk and derives key/fingerprint policy.
3. **Pre-call checkpoint** — `hooks/pre-tool-call.md` validates no conflicting prior execution.
4. **Execute** — record `started`, invoke once, then record terminal evidence.
5. **Failure routing** — explicit failure follows bounded retry; timeout/disconnect becomes `unknown`.
6. **Ambiguous outcome investigation** — use read-only status/history before replay.
7. **Approval checkpoint** — high/critical unknown replay stops for explicit human approval.
8. **Post-call gate** — run `scripts/idempotency_gate.py`.
9. **Host verification** — run relevant tests/build/static checks.
10. **Independent review** — Replay Verifier evaluates evidence.
11. **Complete** — only after Definition of Done.

## Produced artifacts
Execution contract, trace events, gate report, investigation evidence, approval record if applicable, host test/build evidence, verification status.

## Retry rules
Transient non-ambiguous tool failure: maximum 2 retries unless the provider contract specifies fewer. Trace/status read failures: maximum 2. Implementation/test-fix cycles: maximum 2. Unknown high/critical outcome: no automatic replay.

## Failure paths
Validation error blocks. Permission failure blocks. Key collision blocks. Duplicate commit triggers incident/escalation. Conflicting external evidence blocks.

## Definition of Done
Every side-effecting call has a stable key/fingerprint, trace is valid, deterministic gate passes, required approval exists, host checks pass, independent status is `verified`, and no blocking ambiguity remains.