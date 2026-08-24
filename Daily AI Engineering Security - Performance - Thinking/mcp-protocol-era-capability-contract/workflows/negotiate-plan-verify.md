# Workflow: Negotiate, Plan, Verify

## Trigger
An agent task depends on MCP behavior that varies by effective protocol era or negotiated capability.

## Goal
Prevent execution of unsupported plan steps using observable session evidence.

## Inputs
Endpoint/transport, negotiation policy, task goal, capability vocabulary.

## Baseline
Record unsupported-method and capability-mismatch rates before adopting the gate when historical telemetry is available.

## Context
SDK/runtime version, session identity, negotiated version, effective era/capabilities.

## Stages
1. Observe: connect and capture negotiation result.
2. Measure: build a session capability snapshot.
3. Diagnose: if connection failed, classify failure without inventing capabilities.
4. Form plan: declare required capability names for executable steps.
5. Gate: run deterministic checker.
6. If pass, execute while snapshot remains valid.
7. If fail, replan once using the observed capability set, then gate again.
8. Verify: confirm no unsupported-method failure occurred and snapshot did not drift.

## Responsible agent
Connection host for stages 1-2; planner for stage 4 and one retry; Capability Verifier for stages 5 and 8.

## Tools
MCP runtime introspection, structured logs, `scripts/check_capability_contract.py`.

## Outputs
Snapshot, plan requirements, gate report, execution/verification result.

## Checkpoints
After connection; before execution; after any reconnect; final completion.

## Metrics
Gate failures, prevented unsupported calls, replans, unsupported-method errors after gate.

## Retry policy
Maximum one replan for capability mismatch. Connection retries follow the host policy and are not treated as capability evidence.

## Stop conditions
Gate pass and stable snapshot; second plan mismatch; invalid evidence; security/authorization failure.

## Failure path
Return missing requirements and session facts. Do not broaden capabilities or suppress the gate.

## Verification
Independent verifier reruns checker and confirms executed capabilities were a subset of the frozen snapshot.

## Definition of Done
Observed session facts are captured, plan requirements are explicit, gate passes, execution uses only supported capabilities, and verification status is recorded.
