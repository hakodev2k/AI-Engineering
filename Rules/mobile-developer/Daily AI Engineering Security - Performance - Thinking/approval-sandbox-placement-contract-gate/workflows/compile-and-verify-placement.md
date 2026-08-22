# Workflow: Compile and Verify Placement

## Trigger
A command rule, permission profile, denied-read configuration, approval mode, or broker definition is created/changed, or a command requests host placement.

## Goal
Produce and verify an explicit command contract in which approval, placement, and confidentiality are independently enforceable.

## Inputs
Command identity, approval policy, requested placement, permission profile, confidentiality invariants, requested capabilities, broker identifier, broker capability declaration, and human approval state.

## Baseline
Capture current rule decision, actual observed placement, active denied reads, and any prompt/escalation behavior. Do not claim a mismatch until requested and observed placement have both been recorded.

## Context
Use observable Facts, Assumptions, Policy contract, Evidence, Decision, Risks, and Verification status. Do not request hidden reasoning.

## Stages
1. **Observe** — record the current rule, permission profile, and effective sandbox state.
2. **Measure baseline** — use a non-secret capability probe to determine actual placement without reading protected data.
3. **Diagnose** — identify whether approval and placement are conflated or whether a requested placement is unrealizable under current invariants.
4. **Form hypothesis** — define an explicit approval + placement + invariant contract.
5. **Compile policy** — encode the contract in gate input and trusted configuration.
6. **Gate** — run `scripts/placement_policy_gate.py`.
7. **Approval checkpoint** — if required, obtain action-bound human approval and rerun the gate; maximum one approval round per unchanged contract.
8. **Independent review** — Security Policy Reviewer verifies broker trust, capability scope, and invariant preservation.
9. **Execute/probe** — perform the allowed sandbox or broker path and verify effective placement.
10. **Compare** — requested and observed placement MUST match; otherwise block and record a mismatch.

## Responsible agent
Policy analyst compiles the contract. Security Policy Reviewer independently verifies. Runtime executes only the verified decision.

## Tools
Read-only config/rule access, non-secret placement probes, `scripts/placement_policy_gate.py`, and audit logs.

## Outputs
Baseline, compiled contract, deterministic decision, approval evidence when required, independent review, effective-placement probe, and final status.

## Checkpoints
- C1: confidentiality invariants recorded.
- C2: baseline placement measured.
- C3: approval and placement separated.
- C4: broker trust/capabilities verified if host placement is requested.
- C5: effective placement matches the contract.

## Metrics
Placement mismatches, denied unsafe host requests, trusted broker executions, high-risk approvals, invariant violations, and silent fallback count.

## Retry policy
At most two policy-correction cycles. A retry MUST change the contract/configuration and MUST rerun deterministic validation plus placement verification.

## Stop conditions
Stop successfully when deterministic validation, independent review, and placement probe all pass. Stop with failure when safe placement is unrealizable, broker trust is missing, confidentiality would be weakened, approval is denied/absent, or two correction cycles fail.

## Failure path
Keep the command sandboxed when possible; otherwise deny. Preserve protected-resource boundaries, record the mismatch, and escalate policy design. Never disable denied reads to force success.

## Verification
Run unit tests and an environment-specific non-secret placement probe. Host execution is verified only if the trusted broker path is demonstrably distinct from the agent sandbox and preserves the declared boundary.

## Definition of Done
Evidence documented; baseline measured; policy contract explicit; confidentiality preserved; broker trust verified when used; required approval obtained; tests pass; requested and observed placement match; and independent review passes.
