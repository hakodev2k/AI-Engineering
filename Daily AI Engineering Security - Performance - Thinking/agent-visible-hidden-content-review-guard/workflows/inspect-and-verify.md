# Workflow: Inspect and Verify Review Input

## Trigger
Agent receives externally writable review or diagnostic content.

## Goal
Prevent hidden or non-human-visible text from steering privileged actions.

## Inputs
Raw content, rendered content, provenance, requested action.

## Baseline
Capture the exact raw payload and the human-visible rendering before agent execution.

## Context
Use only the externally writable fields, visible rendering, action request, and applicable permission policy.

## Stages
1. **Observe** — identify externally writable fields and provenance.
2. **Measure baseline** — record raw-vs-visible delta and hidden-content findings.
3. **Diagnose** — determine whether findings can influence action selection.
4. **Form hypothesis** — state the specific trust-boundary failure in observable terms.
5. **Implement improvement** — strip authority from hidden content while preserving it as quarantined evidence.
6. **Measure again** — rerun the deterministic guard.
7. **Improved?** If no, perform one remediation retry; if yes, continue.
8. **Verify** — independent reviewer confirms privileged-action evidence is human-visible.

## Responsible agent
Implementation owner performs normalization/integration; Review Security Verifier independently verifies.

## Tools
Read-only content fetch, renderer, `scripts/review_visibility_guard.py`, unit tests.

## Outputs
Guard result, hidden-content findings, provenance record, privileged-action evidence, verification decision.

## Checkpoints
Before model review, before privileged tool call, and after remediation.

## Metrics
Attack-fixture block rate, hidden-delta count, visible-evidence coverage, false-positive review count.

## Retry policy
Maximum 1 automated normalization/remediation retry.

## Stop conditions
Unresolved hidden delta, provenance ambiguity, secret exposure risk, or missing visible evidence.

## Failure path
Block autonomous action, preserve raw evidence, and route to a safe human-visible rendering.

## Verification
Security Verifier must reproduce the guard result and confirm least-privilege boundaries are not weakened.

## Definition of Done
Guard passes for benign visible data, malicious hidden fixtures block, privileged actions have visible evidence, and independent verification passes.
