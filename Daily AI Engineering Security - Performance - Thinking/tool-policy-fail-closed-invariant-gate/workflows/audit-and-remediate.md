# Workflow: Audit and Remediate Tool Policy

## Trigger
A tool-policy change, new execution mode, sandbox/tool registry change, security report, or failed pre-agent policy hook.

## Goal
Make effective model-visible and executable capabilities conform to the declared least-privilege policy.

## Inputs
Policy files, known tools, provider-visible tools, runtime-executable tools, execution mode, failure evidence.

## Baseline
Capture the failing snapshot and run `scripts/tool_policy_gate.py`. Record violation count and exposed high-impact tools before any change.

## Stages
1. **Observe** — Policy Auditor records exact policy presence and effective sets.
2. **Measure baseline** — Gate produces deterministic violations.
3. **Diagnose** — Identify parsing, precedence, fallback, mode-routing, registry, or dispatcher divergence.
4. **Form hypothesis** — State one testable cause and expected corrected effective set.
5. **Implement** — Change the smallest policy/runtime layer needed; preserve restrictions.
6. **Measure again** — Repeat the same snapshot/gate and regression tests.
7. **Re-evaluate if not improved** — Maximum 2 implementation cycles; return to diagnosis with new evidence.
8. **Independent verification** — Security Verifier runs the affected-mode matrix.

## Responsible agent
Policy Auditor for observation/diagnosis; implementation owner for code changes; Security Verifier for final verification.

## Tools
Configuration inspection, runtime introspection, unit/integration tests, policy gate, source control diff.

## Outputs
Before/after policy snapshots, root cause, implementation evidence, test results, verification verdict.

## Checkpoints
- Baseline exists before implementation.
- No change broadens allowed tools.
- Explicit-empty behavior is tested.
- Provider/runtime sets are both captured.
- Independent verification occurs for high-impact changes.

## Metrics
Forbidden-tool exposure count, violation count, mode parity, test pass rate.

## Retry policy
Maximum 2 remediation cycles. A failed cycle must add new evidence or a different hypothesis.

## Stop conditions
Stop successfully only when the gate and regression suite pass and independent verification reports no blocking violation. Stop unsuccessfully after two failed remediation cycles or unresolved policy semantics.

## Failure path
Fail closed for sensitive tools, preserve logs/snapshots, and escalate to the policy/security owner. Do not restore broad defaults.

## Verification
Run `python -m unittest tests/test_tool_policy_gate.py` and the target-system integration matrix.

## Definition of Done
Evidence documented; baseline captured; root cause identified; fix implemented; tests pass; provider/runtime sets conform; high-impact boundaries preserved; independent verification complete; no blocking issue remains.
