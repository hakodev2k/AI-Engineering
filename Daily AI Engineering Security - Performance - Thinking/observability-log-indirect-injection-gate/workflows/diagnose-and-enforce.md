# Workflow: Diagnose and Enforce Observability Trust Boundary

## Trigger
An agent consumes observability/incident evidence and proposes a tool action that may change state, access secrets, persist configuration, or use external network access.

## Goal
Preserve useful investigation while preventing untrusted evidence from becoming implicit authorization.

## Inputs
Telemetry source metadata, evidence IDs, proposed action, capability list, resource/environment, policy, approval/remediation contract if present.

## Baseline
Before rollout, record the number of telemetry-derived actions, how many are high impact, current approval coverage, and any actions that execute without provenance metadata.

## Context
Use only structured provenance and action metadata needed for the decision. Raw telemetry may remain available to the investigative agent but is not itself authorization.

## Stages
1. **Observe** — identify source classes and whether attacker-controlled content can enter each source.
2. **Measure baseline** — count unclassified and unapproved high-impact actions.
3. **Diagnose** — map the exact action boundary where shell/network/write/infra/secret operations execute.
4. **Form hypothesis** — state which provenance-aware rule would block the attack path without blocking read-only analysis.
5. **Implement** — attach source lineage and run the deterministic gate immediately before the side effect.
6. **Measure again** — replay benign and adversarial fixtures.
7. **Independent verify** — use `subagents/security-reviewer.md` or an equivalent independent reviewer.
8. **Complete** — record Implemented, Measured, and Verified separately.

## Responsible agent
Implementation agent owns stages 1–6. Independent security reviewer owns stage 7.

## Tools
Read-only observability APIs, `scripts/provenance_action_gate.py`, unit tests, host audit logs, approval mechanism.

## Outputs
Baseline report, source/action map, gate decisions, test results, approval evidence, verification result.

## Checkpoints
- Provenance exists before action evaluation.
- Capability classification matches the real executor.
- Approval is bound to exact action hash.
- No policy change broadens permissions without review.

## Metrics
Unauthorized side effects, high-impact provenance coverage, exact-approval coverage, false blocks, secret exposure count.

## Retry policy
At most 2 implementation/re-test cycles for the same hypothesis. A retry MUST change code, policy, fixture, or diagnosis based on new evidence.

## Stop conditions
Stop successfully only when adversarial high-impact fixtures cannot execute without authorization and benign read-only fixtures still pass. Stop unsuccessfully after two failed remediation cycles and escalate with evidence.

## Failure path
If the runtime cannot intercept the true side-effect boundary, disable the affected high-impact integration or require external approval outside the agent until the boundary is enforceable.

## Verification
Run `python -m unittest tests/test_provenance_action_gate.py` from the package root and verify host integration separately.

## Definition of Done
Evidence documented; baseline captured; trust boundary mapped; gate integrated; tests pass; no secrets exposed; approval scope verified; independent review passes; no blocking bypass remains.
