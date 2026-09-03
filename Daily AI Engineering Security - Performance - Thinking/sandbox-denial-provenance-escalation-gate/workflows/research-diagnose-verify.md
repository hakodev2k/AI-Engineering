# Workflow: Research, Diagnose, Implement, Verify

## Trigger
A sandbox denial is observed, an alternate execution tool is added, or a policy-provenance regression is suspected.

## Goal
Preserve denial semantics across the entire agent control path and prevent unauthorized equivalent fallback.

## Inputs
Policy, tool traces, denial samples, alternate executors, representative fixtures.

## Baseline
Measure how many denied fixtures retain structured provenance and how many equivalent fallback attempts currently execute.

## Stages
1. **Observe** — collect authoritative sandbox decisions and model-facing results.
2. **Measure baseline** — record provenance preservation and bypass rates.
3. **Diagnose** — find the serialization/adapter boundary where denial semantics disappear.
4. **Form hypothesis** — state the expected invariant and affected execution surfaces.
5. **Implement** — add normalized denial envelope, ledger persistence, and pre-execution gate.
6. **Measure again** — replay the same fixtures.
7. **Independent verification** — Security Verifier checks denied, approved, malformed, and non-equivalent cases.

## Responsible agent
Implementer for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Structured logs, source inspection, `scripts/denial_gate.py`, test fixtures.

## Outputs
Before/after metrics, denial schema evidence, test results, verification status.

## Checkpoints
- Baseline captured before implementation.
- Policy decision remains observable after tool-result normalization.
- Alternate tool surface is checked before execution.
- Approval scope includes trust zone and target.

## Metrics
100% provenance preservation; 0 unauthorized equivalent fallbacks; 100% expected-denial tests blocked.

## Retry policy
At most two implementation/verification cycles. Each retry must identify a different failing boundary or concrete defect.

## Stop conditions
Stop successfully when verification passes. Stop as failed after two remediation cycles or whenever authoritative policy state cannot be obtained safely.

## Failure path
Fail closed, keep the denied capability unavailable, record evidence, and escalate to a human security owner. Never enable a broader executor as fallback.

## Definition of Done
Baseline documented, gap identified, gate implemented, deterministic tests pass, independent verification passes, risks documented, and no blocking issue remains.
