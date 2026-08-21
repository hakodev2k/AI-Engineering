# Workflow: Taint → Tool Authorization → Independent Verification

## Trigger
Untrusted repository/external content is introduced, a high-impact tool is added or reclassified, auto-approval behavior changes, or sandbox/network/credential permissions expand.

## Goal
Ensure untrusted content cannot cause privileged side effects without deterministic authorization and required approval.

## Inputs
Trust policy, context provenance, tool descriptor, repository trust state, environment capabilities, approval state, and adversarial fixtures.

## Baseline
Before changes, record how representative benign and adversarial fixtures are currently classified. Document any unsafe auto-approved path as a baseline finding rather than executing it against a real target.

## Context
Read `evidence/research.md`, `skills/untrusted-context-threat-model.md`, and `rules/untrusted-repository-content.md`.

## Stages
1. **Observe** — Inventory context sources and tool side effects.
2. **Measure baseline** — Run the taint gate against benign and attack fixtures; record existing allow/approval/deny outcomes.
3. **Diagnose** — Find missing provenance, under-classified tools, or dangerous capability combinations.
4. **Form hypothesis** — Choose one policy/integration fix that closes the observed path.
5. **Implement** — Propagate provenance or update deterministic policy/tool metadata.
6. **Measure again** — Re-run the exact fixture matrix.
7. **Checkpoint** — Attack fixtures must be blocked/approval-gated as expected while benign trusted fixtures remain usable.
8. **Retry** — At most one policy/integration retry when the failing fixture is understood. Do not broaden privileges to pass.
9. **Independent verification** — Security Reviewer checks provenance, policy, sandbox, approval binding, and audit records.
10. **Complete** — Mark implementation, measurement, and verification separately.

## Responsible agent
Implementation Agent integrates provenance/policy. Security Reviewer independently verifies. Human approver handles any intentionally dangerous or irreversible real-world action.

## Tools
`scripts/taint_gate.py`, unit tests, isolated synthetic repositories, mock network endpoints, and redacted audit logs.

## Outputs
Threat model, baseline fixture results, policy/integration change, post-change results, independent verification verdict.

## Checkpoints
- All context sources have known trust state.
- High-impact tools have explicit capability metadata.
- Repository-code execution is recognized even when invoked via test/build/package tools.
- Secret + network dangerous combinations are denied.
- Required approval is bound to the current action/revision.

## Metrics
Provenance coverage, high-impact tool coverage, attack-fixture block rate, required-approval coverage, benign false-block rate, and decisions with unknown provenance.

## Retry policy
Maximum one retry after a failed post-change fixture. A second failure stops the workflow and escalates.

## Stop conditions
Stop immediately on sandbox escape, contact with a real external destructive target, real-secret exposure, unknown provenance on an attempted high-impact action, or exhausted retry budget.

## Failure path
Disable auto-approval for the affected tool/path, preserve evidence, and escalate to a human security owner. Never resolve failure by removing provenance checks or sandbox restrictions.

## Verification
Verification requires deterministic negative tests and independent review. LLM refusal behavior alone is not sufficient evidence.

## Definition of Done
- Current evidence documented.
- Context-source and tool-impact inventories complete.
- Baseline captured.
- Root cause identified.
- Deterministic gate integrated/configured.
- Attack fixtures produce expected deny/approval decisions.
- Benign fixture behavior is measured.
- No real secrets or destructive targets used.
- Independent Security Reviewer returns Verified.
- No blocking issue remains.
