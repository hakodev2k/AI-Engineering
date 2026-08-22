# Sandbox Failure Escalation Diagnosis Gate

**Category:** Thinking

## Problem
A sandboxed operation can fail because the helper/runtime itself is broken, yet an agent may infer that the requested action needs broader permissions. With Auto-review, this can become a hidden loop of escalation requests and quota-consuming reviewer turns without fixing the underlying failure.

## Evidence
See `evidence/research.md`. Current reports show repeated workspace-local `apply_patch` escalations caused by Windows helper failures, Bubblewrap failures occurring before target access, and reviewer timeouts that explicitly should not be interpreted as a security judgment.

## Existing approach
Retry outside the sandbox, invoke Auto-review/guardian, ask the user, or restart/repair the runtime.

## Existing limitations
The causal link between failure and permission need is often assumed rather than tested. Approval success can also be mistaken for remediation success.

## Proposed improvement
Require an observable diagnosis record before escalation: Facts, Assumptions, bounded Hypotheses, Evidence, Decision, Risks, and Verification status. Compare target resources with the effective boundary, correlate repeated signatures, and circuit-break repeated escalation when the original failure persists.

## Architecture
- `skills/escalation-root-cause-analysis.md`: diagnosis procedure.
- `rules/escalation-rules.md`: enforceable least-privilege and evidence rules.
- `subagents/escalation-verifier.md`: independent reviewer.
- `workflows/diagnose-before-escalate.md`: bounded workflow.
- `hooks/pre-escalation-evidence-gate.md`: deterministic blocking gate.
- `scripts/escalation_trace_checker.py`: machine-readable decision validator.
- `evidence/research.md`: current public evidence.

## Installation
Requires Python 3.9+. Integrate the hook before any code path that retries outside the current sandbox or invokes an approval reviewer because a sandboxed attempt failed.

## Configuration
Define the effective sandbox boundary and a stable failure-signature scheme. Default automatic escalation budget is one per failure signature; human-reviewed reset is permitted only with new evidence/risk review.

## Usage
Write escalation decisions as JSONL containing `signature`, `decision`, `facts`, `evidence`, `verification_status`, and, for escalation, `boundary_crossing: true`. Run:

`python3 scripts/escalation_trace_checker.py escalation-events.jsonl --max-per-signature 1`

Exit 0 passes, 2 means invalid input, and 3 means the evidence or loop contract was violated.

## Workflow
Observe raw failure → measure boundary relation → form bounded hypotheses → run safe discriminators → decide → if justified, approve/escalate once → verify task postcondition and disappearance of the original failure → independently review.

## Metrics
Escalations/task, repeated-signature escalations, reviewer calls/task, escalation remediation rate, same-failure-after-approval rate, diagnostic cycles, rework rate, unsupported-conclusion rate.

## Verification
Every escalation must have objective boundary evidence. The task must succeed after escalation and the original failure signature must disappear. Approval alone is not verification. Repeated same-signature escalation is a test failure.

## Safety
Least privilege remains the default. Never broaden access simply to get past a helper/runtime failure, reduce quota usage, or avoid diagnosis. Dangerous/irreversible permission changes require explicit human approval.

## Failure handling
Detection is performed by the gate/checker and postcondition verification. Retry diagnosis at most twice. Approval timeout may be retried once. If the boundary cannot be established, the result is indeterminate/BLOCK. Preserve evidence and escalate to a human/operator instead of weakening policy.

## Implemented / Measured / Verified
**Implemented** means the diagnosis/gate integration exists. **Measured** means escalation/reviewer and failure-signature metrics are captured. **Verified** means the decision validator, task postcondition, signature disappearance, and independent Escalation Verifier all pass.

## Definition of Done
Evidence documented; effective boundary captured; failure signature stable; hypotheses bounded; escalation justified or rejected from evidence; retries bounded; reviewer volume measured; task postcondition verified; no repeated same-signature escalation; independent verifier passes; no blocking issue remains.

## Customization
Add platform-specific failure classifiers for Windows helper launch, Bubblewrap/user namespaces, temporary-directory ACLs, or approval-reviewer failures while preserving the evidence-before-escalation contract.