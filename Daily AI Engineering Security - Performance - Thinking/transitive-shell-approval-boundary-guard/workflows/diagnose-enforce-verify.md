# Workflow: Diagnose → Enforce → Verify

## Trigger
A shell/interpreter approval bypass is suspected, or an agent execution policy is being introduced or changed.

## Goal
Block or escalate unapproved transitive effects without removing required legitimate shell capability.

## Inputs
Command samples, policy, trusted roots, protected resources, current approval behavior, and harmless reproduction fixtures.

## Baseline
Capture how the current system treats: direct destructive command, benign script wrapper, nested destructive script, out-of-root script, inline interpreter code, and unreadable script. Record allow/prompt/block outcomes before changing policy.

## Context
Use `skills/transitive-execution-threat-model.md` and `rules/approval-boundary.md`.

## Stages
1. **Observe** — collect literal commands and current hook/permission decisions.
2. **Measure baseline** — execute only harmless sentinel fixtures and record misses/false positives.
3. **Diagnose** — map direct and transitive execution edges and identify where authorization loses visibility.
4. **Form hypothesis** — define one concrete bypass mechanism and the expected guard signal.
5. **Implement improvement** — configure and integrate `scripts/approval_guard.py` as a blocking pre-execution check.
6. **Measure again** — rerun exactly the baseline fixtures and compare decisions/latency.
7. **Independent verification** — Security Verifier reviews implementation and fixtures.
8. **Complete** — archive structured evidence and residual limitations.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Read-only inspection, Python 3, deterministic fixture tests, existing sandbox/hook system.

## Outputs
Before/after matrix, guard decisions, test results, residual-risk statement, and verification status.

## Checkpoints
- Baseline recorded before policy change.
- No test uses production data or irreversible commands.
- Every `allow` for a script has an inspected path and content digest where available.
- Independent reviewer signs off before completion.

## Metrics
Known-bypass detection rate, benign pass rate, unresolved-chain rate, policy latency, and number of high-risk auto-allows.

## Retry policy
At most 2 implementation iterations. A retry requires a new finding, changed hypothesis, or changed policy. Repeating the same failed test without a change is not a retry strategy.

## Stop conditions
Stop and escalate when parsing remains ambiguous after 2 iterations, policy would require broadening privileges, or a real irreversible action would be needed for verification.

## Failure path
Detection failure → preserve evidence → fail closed for the affected command class → escalate. Excessive false positives → retain existing sandbox/approval protections, narrow static patterns with new benign fixtures, and rerun once.

## Verification
All package tests pass and independent review confirms the configured attack fixture is blocked without weakening other security boundaries.

## Definition of Done
Implemented: guard integrated. Measured: before/after matrix captured. Verified: independent tests pass, high-risk fixture blocked, benign fixture allowed, and no blocking residual issue remains.
